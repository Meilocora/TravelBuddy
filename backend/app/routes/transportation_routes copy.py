from datetime import datetime
from flask import Blueprint, jsonify, request
from db import db
from app.routes.route_protection import token_required
from app.models import Costs, Spendings, Journey, MajorStage, Transportation, MinorStage
from app.validation.transportation_validation import TransportationValidation
from app.routes.util import calculate_minor_stage_costs, calculate_major_stage_costs, calculate_journey_costs

transportation_bp = Blueprint('transportation', __name__)

@transportation_bp.route('/create-major-stage-transportation/<int:majorStageId>', methods=['POST'])
@token_required 
def create_major_stage_transportation(current_user, majorStageId):
    try:
        transportation = request.get_json()
        major_stage = db.get_or_404(MajorStage, majorStageId)
        journey = db.get_or_404(Journey, major_stage.journey_id)
        major_stage_costs = db.session.execute(db.select(Costs).filter_by(major_stage_id=majorStageId)).scalars().first()
        journey_costs = db.session.execute(db.select(Costs).filter_by(journey_id=journey.id)).scalars().first()
         
    except:
        return jsonify({'error': 'Unknown error'}, 400) 
    
    response, isValid = TransportationValidation.validate_transportation(transportation)
    
    if not isValid:
        return jsonify({'transportationFormValues': response, 'status': 400})
    
    # Update costs of Journey and Major Stage, if transportation_costs are provided
    if transportation['transportation_costs']['value'] != '':
        # Add spending for major_stage_costs if transportation_costs are provided
        try:
            new_spendings = Spendings(
                costs_id=major_stage_costs.id,
                name='Transportation to ' + transportation['place_of_arrival']['value'],
                amount=int(transportation['transportation_costs']['value']),
                date=datetime.now().strftime('%d.%m.%Y'),
                category='Transportation'
            )
            db.session.add(new_spendings)
            db.session.commit()
        except Exception as e:
            return jsonify({'error': str(e)}, 500)
        
        calculate_journey_costs(journey_costs)
    
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
        major_stage_costs = db.session.execute(db.select(Costs).filter_by(major_stage_id=majorStageId)).scalars().first()
        journey_costs = db.session.execute(db.select(Costs).filter_by(journey_id=journey.id)).scalars().first()
         
    except:
        return jsonify({'error': 'Unknown error'}, 400) 
    
    response, isValid = TransportationValidation.validate_transportation(new_transportation)
    
    if not isValid:
        return jsonify({'transportationFormValues': response, 'status': 400})
    
    # Update costs of Journey and Major Stage, if transportation_costs are provided
    if new_transportation['transportation_costs']['value'] != '':
        # Update or create spendings, depending on whether the transportation already exists and if the transportation_costs are provided and have changed
        old_spendings = db.session.execute(db.select(Spendings).filter_by(costs_id=major_stage_costs.id, name='Transportation to ' + old_transportation.place_of_arrival)).scalars().first()
        
        if not old_spendings:
            try:
                new_spendings = Spendings(
                    costs_id=major_stage_costs.id,
                    name='Transportation to ' + new_transportation['place_of_arrival']['value'],
                    amount=int(new_transportation['transportation_costs']['value']),
                    date=datetime.now().strftime('%d.%m.%Y'),
                    category='Transportation'
                )
                db.session.add(new_spendings)
                db.session.commit()
            except Exception as e:
                return jsonify({'error': str(e)}, 500)
        else:
            old_spendings.amount = int(new_transportation['transportation_costs']['value'])
            old_spendings.date = datetime.now().strftime('%d.%m.%Y')
            try:
                db.session.commit()
            except Exception as e:
                return jsonify({'error': str(e)}, 500)
            
        calculate_journey_costs(journey_costs)
    
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
    major_stage = db.get_or_404(MajorStage, majorStageId)
    major_stage_costs = db.session.execute(db.select(Costs).filter_by(major_stage_id=majorStageId)).scalars().first()
    transport_spending = db.session.execute(db.select(Spendings).filter_by(costs_id=major_stage_costs.id, category='Transportation')).scalars().first()

    try:        
        db.session.delete(transport_spending)
        db.session.commit()
        
        db.session.execute(db.delete(Transportation).where(Transportation.major_stage_id == majorStageId))
        db.session.commit()    
        return jsonify({'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    