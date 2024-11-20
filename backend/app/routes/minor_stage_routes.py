from flask import Blueprint, jsonify
from db import db
from app.models import Costs, MinorStage, Transportation, Accommodation, Activity, PlaceToVisit

minor_stage_bp = Blueprint('minor_stage', __name__)

@minor_stage_bp.route('/get-minor-stages/<int:majorStageId>', methods=['GET'])
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