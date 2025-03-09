from flask import Blueprint, jsonify, request
from db import db
from app.routes.route_protection import token_required
from app.models import Costs, Spendings, Journey, MajorStage, Transportation, MinorStage
from app.validation.transportation_validation import TransportationValidation
from app.routes.util import calculate_journey_costs

transportation_bp = Blueprint('transportation', __name__)

@transportation_bp.route('/create-major-stage-transportation/<int:majorStageId>', methods=['POST'])
@token_required 
def create_major_stage_transportation(current_user, majorStageId):
    try:
        transportation = request.get_json()
        major_stage = db.get_or_404(MajorStage, majorStageId)
        journey = db.get_or_404(Journey, major_stage.journey_id)
        journey_costs = db.session.execute(db.select(Costs).filter_by(journey_id=journey.id)).scalars().first()
         
    except:
        return jsonify({'error': 'Unknown error'}, 400) 
    
    response, isValid = TransportationValidation.validate_transportation(transportation)
    
    if not isValid:
        return jsonify({'transportationFormValues': response, 'status': 400})
    
    try:
        # Create a new transportation
        new_transportation = Transportation(
            type=transportation['type']['value'],
            start_time=transportation['start_time']['value'],
            arrival_time=transportation['arrival_time']['value'],
            place_of_departure=transportation['place_of_departure']['value'],
            place_of_arrival=transportation['place_of_arrival']['value'],
            transportation_costs=transportation['transportation_costs']['value'],
            link=transportation['link']['value'],
            major_stage_id=majorStageId
        )
        db.session.add(new_transportation)
        db.session.commit()
        
        calculate_journey_costs(journey_costs)
        
        # build response transportation object for the frontend
        response_transportation = {'id': new_transportation.id,
                                    'type': new_transportation.type,
                                    'start_time': new_transportation.start_time,
                                    'arrival_time': new_transportation.arrival_time,
                                    'place_of_departure': new_transportation.place_of_departure,
                                    'place_of_arrival': new_transportation.place_of_arrival,
                                    'transportation_costs': new_transportation.transportation_costs,
                                    'link': new_transportation.link}
        
        return jsonify({'transportation': response_transportation, 'status': 201})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    
    
@transportation_bp.route('/update-major-stage-transportation/<int:majorStageId>/<int:transportationId>', methods=['POST'])
@token_required 
def update_major_stage_transportation(current_user, majorStageId, transportationId):
    try:
        new_transportation = request.get_json()
        old_transportation = db.get_or_404(Transportation, transportationId)
        major_stage = db.get_or_404(MajorStage, majorStageId)
        journey = db.get_or_404(Journey, major_stage.journey_id)
        journey_costs = db.session.execute(db.select(Costs).filter_by(journey_id=journey.id)).scalars().first()
         
    except:
        return jsonify({'error': 'Unknown error'}, 400) 
    
    response, isValid = TransportationValidation.validate_transportation(new_transportation)
    
    if not isValid:
        return jsonify({'transportationFormValues': response, 'status': 400})
    
    try:
        # Update old transportation
        old_transportation.type = new_transportation['type']['value']
        old_transportation.start_time = new_transportation['start_time']['value']
        old_transportation.arrival_time = new_transportation['arrival_time']['value']
        old_transportation.place_of_departure = new_transportation['place_of_departure']['value']
        old_transportation.place_of_arrival = new_transportation['place_of_arrival']['value']
        old_transportation.transportation_costs = new_transportation['transportation_costs']['value']
        old_transportation.link = new_transportation['link']['value']
        db.session.commit()
        
        calculate_journey_costs(journey_costs)
        
        # build response transportation object for the frontend
        response_transportation = {'id': old_transportation.id,
                                    'type': new_transportation['type']['value'],
                                    'start_time': new_transportation['start_time']['value'],
                                    'arrival_time': new_transportation['arrival_time']['value'],
                                    'place_of_departure': new_transportation['place_of_departure']['value'],
                                    'place_of_arrival': new_transportation['place_of_arrival']['value'],
                                    'transportation_costs': new_transportation['transportation_costs']['value'],
                                    'link': new_transportation['link']['value']}

        return jsonify({'transportation': response_transportation, 'status': 201})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    
    
@transportation_bp.route('/delete-major-stage-transportation/<int:majorStageId>', methods=['DELETE'])
@token_required
def delete_major_stage_transportation(current_user, majorStageId):
    journey = db.session.execute(db.select(Journey).join(MajorStage).filter(MajorStage.id == majorStageId)).scalars().first()
    journey_costs = db.session.execute(db.select(Costs).filter_by(journey_id=journey.id)).scalars().first()
    try:        
        db.session.execute(db.delete(Transportation).where(Transportation.major_stage_id == majorStageId))
        db.session.commit()    
        
        calculate_journey_costs(journey_costs)
        
        return jsonify({'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    