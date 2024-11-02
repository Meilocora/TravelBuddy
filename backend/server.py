import sys
import os
from flask import Flask, jsonify
from flask_cors import CORS

from db import db
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.dummy_data import add_dummy_data
from app.models import *



app = Flask(__name__)
app.config['SECRET_KEY'] = "8BYkEfBA6O6donzWlSihBXox7C0sKR6b"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///travel_buddy.db'
CORS(app, resources={r'/*': {'origins': '*'}})


db.init_app(app)


with app.app_context():
    db.create_all()     # Create the database
    # add_dummy_data()    # insert some dummy data


@app.route('/get-journeys', methods=['GET'])
def get_journeys():
    try:
        # Get all the journeys from the database
        result = db.session.execute(db.select(Journey))
        
        journeys = result.scalars().all()
        
        journeys_list =  [{
        'id': journey.id,
        'name': journey.name,
        'description': journey.description,
        'scheduled_start_time': journey.scheduled_start_time,
        'scheduled_end_time': journey.scheduled_end_time,
        'countries': journey.countries,
        'done': journey.done,
        } for journey in journeys]
        
        return jsonify(journeys_list, 200)
    except:
        return jsonify({'message': 'Internal Server Error'}, 500)
    


if __name__ == '__main__':
    app.run(host='192.168.178.32', port=3000, debug=True)
