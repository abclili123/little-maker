# backend file used to interact with db and make api calls

from flask import Flask, jsonify, request
import duckdb
import os
import pandas as pd
from dotenv import load_dotenv
import json
from openai import OpenAI
import re
from webscraper import instructables_call

load_dotenv()
OpenAI.api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI()

app = Flask(__name__)
data_dir = "data" # data directory

@app.route('/')  # prevents 404 error
def home():
    return "Flask server is running!"

@app.route("/materials")
def materials():
    # connect to db
    conn = duckdb.connect(os.path.join(data_dir, 'materials.db'))

    # get materials and tags
    query = """
        SELECT m.name, GROUP_CONCAT(mt.tag_name, ', ') as tags
        FROM materials m
        LEFT JOIN material_tags mt ON m.name = mt.material_name
        GROUP BY m.name
    """

    results = conn.execute(query).fetchall()

    TAG_EMOJI_MAP = {
        "3D Printing": "🖨️",
        "Adhesive": "🩹",
        "Jewelry": "💍",
        "Electronics": "🔌",
        "Paper": "📄",
        "Bookbinding": "📚",
        "Marbling": "🌊",
        "Paint": "🎨",
        "Vinyl": "💿",
        "Screen Printing": "🖼️",
        "Sewing": "🧵",
        "Embroidery": "🪡",
        "Textile": "🧶",
        "Other": "🛠️",
        "Stained Glass": "🪟",
        "Rug Tufting": "🪞",
        "Embroidery": "🪡",
        "Dye Sublimation": "🎭",
        "Leatherworking": "👞",
        "Woodworking": "🪓",
        "Fasteners": "🔩",
        "Sanding": "🪚",
        "Lasercutting": "🔦",
        "CNC": "🛠️"
    }

    materials_data = []
    for row in results:
        tags = []
        if row[1]:
            temp_tags = row[1].split(",")
            for tag in temp_tags:
                tags.append(tag.strip())

        materials_data.append(
            {
                "name": row[0], 
                "tags": tags, 
                "emoji": TAG_EMOJI_MAP.get(tags[0]) if len(tags) > 0 else ""
            }
        )

    conn.close()

    # TODO: fix query/ move logic so not iterating over whole db for search 
    # filter by name if query is provided
    query_name = request.args.get("name")
    if query_name:
        materials_data = [m for m in materials_data if query_name.lower() in m["name"].lower()]

    return jsonify(materials_data)

@app.route("/tools")
def tools():
    # connect to db
    conn = duckdb.connect(os.path.join(data_dir, 'tools.db'))

    # get tools
    query = "SELECT * FROM tools;"
    results = conn.execute(query).fetchall()

    tools_data = [
        {"name": row[0], "link": row[1] or "", "description": row[2], "img": "assets/tool_images/" + row[0].lower().replace(" ", "_") + ".png"} for row in results
    ]

    return jsonify(tools_data)

def gpt_call(items):
    response = client.responses.create(
        model="gpt-3.5-turbo",
        input=[
            {
            "role": "system",
            "content": [
                {
                "type": "input_text",
                "text": "You are brainstorming project ideas for a beginner maker to make in a makerspace. The project ideas you come up with will be searched on Instructables for tutorials. You will be given a list of tools and materials and you will return a list of project ideas. Only return the project ideas titles as a comma separated list. Do not include any other information. For example, given ['LED', 'Arduino'] return: Touch Control LED, Interactive LED Wearable, Arduino LED Music Visualizer"
                }
            ]
            },
            {
            "role": "user",
            "content": [
                {
                "type": "input_text",
                "text": f"Using the following tools and and materials, brainstorm 3 project ideas. {items}"
                }
            ]
            },
        ],
        text={
            "format": {
            "type": "text"
            }
        },
        reasoning={},
        tools=[],
        temperature=1,
        max_output_tokens=2048,
        top_p=1,
        store=True
    )

    if response.output and len(response.output) > 0:
        first_output = response.output[0]
        if first_output.content and len(first_output.content) > 0:
            response_text = first_output.content[0].text  
        else:
            response_text = False
    else:
        response_text = False

    return response_text

def validate_response(response_text):
    pattern = r'^(\w[\w\s-]*)(,\s*\w[\w\s-]*)*$'
    return bool(re.match(pattern, response_text))

def get_valid_project_ideas(names, max_attempts=3):
    attempts = 0
    while attempts <= max_attempts:
        project_ideas = gpt_call(names)
        
        if validate_response(project_ideas):
            return project_ideas.split(", ") 
        
        attempts += 1

    return None

@app.route("/generate", methods=["POST"])
def generate_ideas():
    data = request.get_json()
    
    if not data or 'items' not in data:
        return jsonify({"error": "No items provided"}), 400
    
    names = [item["name"] for item in data['items']]
    project_ideas = get_valid_project_ideas(names)

    if not project_ideas:
        # need to return with error
        return False
    
    instructable_results = []
    id = 1
    for project_idea in project_ideas:
        results = instructables_call(project_idea)
        for r in results: # add id to each result
            r['id'] = id
            id+=1
            instructable_results.append(r)
    
    print(instructable_results)
    return jsonify(instructable_results)

def create_materials_database(materials_db):
    # connect to db
    conn = duckdb.connect(materials_db)

    # read all data into temporary table
    conn.execute("""
        CREATE TABLE materials_raw (
            material_name TEXT,
            tags TEXT
        );
    """)
    conn.execute(f"COPY materials_raw FROM '{os.path.join(data_dir, 'materials.csv')}' (HEADER, DELIMITER ',');")
    
    # table for materials
    conn.execute("""
        CREATE TABLE IF NOT EXISTS materials (
            name TEXT UNIQUE NOT NULL
        );
    """)
    
    # table for tags
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tags (
            tag_name TEXT UNIQUE NOT NULL
        );
    """)

    # table to connect materials and tags
    conn.execute("""
        CREATE TABLE IF NOT EXISTS material_tags (
            material_name TEXT,
            tag_name TEXT,
            PRIMARY KEY (material_name, tag_name)
        );
    """)

    # process data into tables
    df = pd.read_sql("SELECT * FROM materials_raw", conn)
    
    for _, row in df.iterrows():
        material_name = row["material_name"]
        tag_list = [tag.strip() for tag in row["tags"].split(",")]

        # insert material into materials table
        conn.execute("INSERT OR IGNORE INTO materials VALUES (?)", (material_name,))
        
        for tag in tag_list:
            # insert tag into tags table
            conn.execute("INSERT OR IGNORE INTO tags VALUES (?)", (tag,))
            
            # insert material-tag relationship
            conn.execute("INSERT OR IGNORE INTO material_tags VALUES (?, ?)", (material_name, tag))
     
    # drop the raw materials table after processing
    conn.execute("DROP TABLE materials_raw")
    
    conn.close()

def create_tools_database(tools_db):
    # connect to db
    conn = duckdb.connect(tools_db)

    # read all data into the table
    conn.execute("""
        CREATE TABLE tools (
            tool_name TEXT,
            link TEXT,
            description TEXT,
        );
    """)

    conn.execute(f"COPY tools FROM '{os.path.join(data_dir, 'tools.csv')}' (HEADER, DELIMITER ',');")

    conn.close()

def create_database():
    # create data directory if not exists
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        print(f"Created directory: {data_dir}")

    # check if materials.db exists
    materials_db = os.path.join(data_dir, 'materials.db')
    # load data if not exists
    if not os.path.exists(materials_db): 
        create_materials_database(materials_db)

    # check if tools.db exists
    tools_db = os.path.join(data_dir, 'tools.db')
    if not os.path.exists(tools_db): 
        create_tools_database(tools_db)

if __name__ == '__main__':
    create_database()
    app.run(host='0.0.0.0', port=8000, debug=True)