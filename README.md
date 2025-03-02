# little-maker

## Set up (mac)
Create a `.env` file and add your API key as `INSTRUCTABLES_KEY`.
Navigate to `flask-server`
```cd flask-server```
Create venv
```python3.11 -m venv venv```
Start the venv 
```source venv/bin/activate```
Download dependencies
```pip install -r requirements.txt```
Start Backend Flask Server, call from flask-server
```python3.11 server.py```
Start Frontend React App
```cd client```
```npm start```