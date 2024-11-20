from flask import Blueprint, jsonify
from db import db
from app.models import Costs, MajorStage, Transportation, MinorStage

major_stage_bp = Blueprint('major_stage', __name__)

@major_stage_bp.route('/get-major-stages/<int:journeyId>', methods=['GET'])
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