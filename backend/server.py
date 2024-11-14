import sys
import os
from flask import Flask, jsonify, request
from flask_cors import CORS


from db import db

sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.journey_validation import JourneyValidation
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
    
@app.route('/create-journey', methods=['POST'])
def create_journey():
    try:
        journey = request.get_json()
    except:
        return jsonify({'error': 'Unknown error'}, 400)
    
    response, isValid = JourneyValidation.validate_journey(journey=journey)
    
    if not isValid:
        return jsonify({'journeyFormValues': response, 'status': 400})
    
    try:
        # Create a new journey
        new_journey = Journey(
            name=journey['name']['value'],
            description=journey['description']['value'],
            scheduled_start_time=journey['scheduled_start_time']['value'],
            scheduled_end_time=journey['scheduled_end_time']['value'],
            countries=journey['countries']['value'],
            done=False
        )
        db.session.add(new_journey)
        db.session.commit()
        
        
        # Create a new costs for the journey
        costs = Costs(
            journey_id=new_journey.id,
            available_money=journey['available_money']['value'],
            planned_costs=0,
            money_exceeded=False
        )
        db.session.add(costs)
        db.session.commit()
        
        response_journey = {'id': new_journey.id,
                'name': new_journey.name,
                'description': new_journey.description,
                'costs': {
                    'available_money': costs.available_money,
                    'planned_costs': costs.planned_costs,
                    'money_exceeded': costs.money_exceeded,
                },
                'scheduled_start_time': new_journey.scheduled_start_time,
                'scheduled_end_time': new_journey.scheduled_end_time,
                'countries': new_journey.countries.split(','),
                'done': new_journey.done,
                'majorStagesIds': []}
        
        return jsonify({'journey': response_journey,'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    
@app.route('/delete-journey/<int:journeyId>', methods=['DELETE'])
def delete_journey(journeyId):
    try:
        # Delete the journey from the database
        db.session.execute(db.delete(Journey).where(Journey.id == journeyId))
        db.session.commit()
        return jsonify({'status': 200})
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
        
        # return jsonify({'error': 'This is an error!', 'status': 500})
        return jsonify({'majorStages': major_stages_list, 'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)


@app.route('/get-minor-stages/<int:majorStageId>', methods=['GET'])
def get_minor_stages(majorStageId):
    try:
        # Get all the minor stages from the database
        result = db.session.execute(db.select(MinorStage).filter_by(major_stage_id=majorStageId).order_by(MinorStage.scheduled_start_time))
        minorStages = result.scalars().all()
        
        # Fetch costs, transportation, accommodation, activities and places_to_visit for each minor_stage
        minor_stages_list = []
        for minorStage in minorStages:
            costs_result = db.session.execute(db.select(Costs).filter_by(minor_stage_id=minorStage.id))
            costs = costs_result.scalars().first()
            
            transportation_result = db.session.execute(db.select(Transportation).filter_by(minor_stage_id=minorStage.id))
            transportation = transportation_result.scalars().first()
            
            accommodation_result = db.session.execute(db.select(Accommodation).filter_by(minor_stage_id=minorStage.id))
            accommodation = accommodation_result.scalars().first()
            
            activities_result = db.session.execute(db.select(Activity).filter_by(minor_stage_id=minorStage.id))
            activities = activities_result.scalars().all()
            
            places_to_visit_result = db.session.execute(db.select(PlaceToVisit).filter_by(minor_stage_id=minorStage.id))
            places_to_visit = places_to_visit_result.scalars().all()
                        
            # Append the whole minor stage, that matches the model from frontend to the list
            minor_stages_list.append({
                'id': minorStage.id,
                'title': minorStage.title,
                'scheduled_start_time': minorStage.scheduled_start_time,
                'scheduled_end_time': minorStage.scheduled_end_time,
                'done': minorStage.done,
                'costs': {
                    'available_money': costs.available_money,
                    'planned_costs': costs.planned_costs,
                    'money_exceeded': costs.money_exceeded,
                },
                'transportation': {
                    'type': transportation.type,
                    'start_time': transportation.start_time,
                    'arrival_time': transportation.arrival_time,
                    'place_of_departure': transportation.place_of_departure,
                    'place_of_arrival': transportation.place_of_arrival,
                    'transportation_costs': transportation.transportation_costs,
                    'link': transportation.link,
                },
                'baseLocation': {
                    'name': accommodation.name,
                    'description': accommodation.description,
                    'place': accommodation.place,
                    'costs': accommodation.costs,
                    'booked': accommodation.booked,
                    'link': accommodation.link,
                },
                'activities': [{'name': activity.name, 'description': activity.description, 'costs': activity.costs, 'booked': activity.booked, 'place': activity.place, 'link': activity.link} for activity in activities],
                'placesToVisit': [{'name': place_to_visit.name, 'description': place_to_visit.description, 'visited': place_to_visit.visited, 'favorite': place_to_visit.favorite, 'link': place_to_visit.link} for place_to_visit in places_to_visit]
            })
        
        return jsonify({'minorStages': minor_stages_list, 'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    

if __name__ == '__main__':
    app.run(host='192.168.178.32', port=3000, debug=True)