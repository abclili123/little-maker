# backend file used to interact with db and make api calls

from flask import Flask, jsonify, request
import duckdb
import os
import pandas as pd

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

    # convert to list of dictionaries
    materials_data = [
        {"name": row[0], "tags": row[1] or ""} for row in results
    ]

    conn.close()

    # filter by name if query is provided
    query_name = request.args.get("name")
    if query_name:
        materials_data = [m for m in materials_data if query_name.lower() in m["name"].lower()]

    return jsonify(materials_data)

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
    # tools_db = os.path.join(data_dir, 'tools.db')
    # if not os.path.exists(tools_db): 
    #     create_tools_database(tools_db)
        
        

if __name__ == '__main__':
    create_database()
    app.run(host='0.0.0.0', port=8000, debug=True)