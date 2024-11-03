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
        
        # Fetch costs and major_stages for each journey
        journeys_list = []
        for journey in journeys:
            costs_result = db.session.execute(db.select(Costs).filter_by(journey_id=journey.id))
            costs = costs_result.scalars().first()
            
            majorStages_result = db.session.execute(db.select(MajorStage).filter_by(journey_id=journey.id))
            majorStages = majorStages_result.scalars().all()
            
            # Append the whole journey, that matches the model from frontend to the list
            journeys_list.append({
                'id': journey.id,
                'name': journey.name,
                'description': journey.description,
                'costs': {
                    'available_money': costs.available_money,
                    'planned_costs': costs.planned_costs,
                    'money_exceeded': costs.money_exceeded,
                },
                'scheduled_start_time': journey.scheduled_start_time,
                'scheduled_end_time': journey.scheduled_end_time,
                'countries': journey.countries.split(','),
                'done': journey.done,
                'majorStagesIds': [majorStage.id for majorStage in majorStages]
            })
        
        return jsonify({'journeys': journeys_list, 'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)


@app.route('/get-major-stages/<int:journeyId>', methods=['GET'])
def get_major_stages(journeyId):
    try:
        # Get all the major stages from the database
        result = db.session.execute(db.select(MajorStage).filter_by(journey_id=journeyId).order_by(MajorStage.scheduled_start_time))
        majorStages = result.scalars().all()
        
        # Fetch costs, transportation and minor_stages for each major_stage
        major_stages_list = []
        for majorStage in majorStages:
            costs_result = db.session.execute(db.select(Costs).filter_by(major_stage_id=majorStage.id))
            costs = costs_result.scalars().first()
            
            transportation_result = db.session.execute(db.select(Transportation).filter_by(major_stage_id=majorStage.id))
            transportation = transportation_result.scalars().first()
            
            minorStages_result = db.session.execute(db.select(MinorStage).filter_by(major_stage_id=majorStage.id))
            minorStages = minorStages_result.scalars().all()
            
            print(costs, transportation, minorStages)
            
            # Append the whole major stage, that matches the model from frontend to the list
            major_stages_list.append({
                'id': majorStage.id,
                'title': majorStage.title,
                'country': majorStage.country,
                'transportation': {
                    'type': transportation.type,
                    'start_time': transportation.start_time,
                    'arrival_time': transportation.arrival_time,
                    'place_of_departure': transportation.place_of_departure,
                    'place_of_arrival': transportation.place_of_arrival,
                    'transportation_costs': transportation.transportation_costs,
                    'link': transportation.link,
                },
                'done': majorStage.done,
                'scheduled_start_time': majorStage.scheduled_start_time,
                'scheduled_end_time': majorStage.scheduled_end_time,
                'costs': {
                    'available_money': costs.available_money,
                    'planned_costs': costs.planned_costs,
                    'money_exceeded': costs.money_exceeded,
                },
                'minorStagesIds': [minorStage.id for minorStage in minorStages]
            })
        
        return jsonify({'majorStages': major_stages_list, 'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)


if __name__ == '__main__':
    app.run(host='192.168.178.32', port=3000, debug=True)
