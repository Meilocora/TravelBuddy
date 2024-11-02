import sys
import os
from flask import Flask, render_template, redirect, url_for, flash
from flask_cors import CORS

from db import db
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.dummy_data import add_dummy_data



app = Flask(__name__)
app.config['SECRET_KEY'] = "8BYkEfBA6O6donzWlSihBXox7C0sKR6b"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///travel_buddy.db'
CORS(app, resources={r'/*': {'origins': '*'}})


db.init_app(app)

# Check if the database file exists
db_path = os.path.join(os.path.dirname(__file__), 'instance/travel_buddy.db')
if not os.path.exists(db_path):
    with app.app_context():
        db.create_all()     # Create the database
        add_dummy_data()    # insert some dummy data


@app.route('/data', methods=['GET'])
def get_data():
    return {"TEST": ["1", "2", "3"]}


if __name__ == '__main__':
    app.run(host='192.168.178.32', port=3000, debug=True)
