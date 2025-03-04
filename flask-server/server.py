# backend file used to interact with db and make api calls

from flask import Flask, jsonify, request
# maybe we can use duckdb for database instead of csv or jsons later
# ex: much easier to search data w SQL

app = Flask(__name__)

@app.route('/')  # prevents 404 error
def home():
    return "Flask server is running!"

@app.route("/materials")
def materials():
    # retrieve data
    # later replace this with retrieving from db
    materials_list = [
        {"name": "PLA Filament", "category": "3D printing, Plastic", "emoji": "🧵"},
        {"name": "Acrylic Sheets", "category": "Laser Cutting, Plastic", "emoji": "🛠️"},
        {"name": "Copper Wire", "category": "Electronics", "emoji": "🔌"}
    ]

    # filter data
    query = request.args.get("name")
    if query: 
        # whatever our querying logic is
        # probably using duckdb will be much easier
        pass

    return jsonify(materials_list)

if __name__ == "__main__":
    app.run(debug=True)