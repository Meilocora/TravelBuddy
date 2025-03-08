from datetime import datetime
from flask import Blueprint, jsonify, request
from db import db
from app.routes.route_protection import token_required
from app.models import Costs, Spendings, Journey, MajorStage, Transportation, MinorStage
from app.validation.transportation_validation import TransportationValidation

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
        journey_costs.spent_money += int(transportation['transportation_costs']['value'])
        journey_costs.money_exceeded = journey_costs.spent_money > journey_costs.budget
        major_stage_costs.spent_money += int(transportation['transportation_costs']['value'])
        major_stage_costs.money_exceeded = major_stage_costs.spent_money > major_stage_costs.budget
        
        try:
            db.session.commit()
        except Exception as e:
            return jsonify({'error': str(e)}, 500)
        
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
    
    
# @major_stage_bp.route('/update-major-stage/<int:journeyId>/<int:majorStageId>', methods=['POST'])
# @token_required
# def update_major_stage(current_user, journeyId, majorStageId):
#     try:
#         major_stage = request.get_json()
#         result = db.session.execute(db.select(MajorStage).filter(MajorStage.id != majorStageId, MajorStage.journey_id==journeyId))
#         existing_major_stages = result.scalars().all()
#         old_major_stage = db.get_or_404(MajorStage, majorStageId)
    
#         existing_major_stages_costs = []
#         for stage in existing_major_stages:
#             existing_major_stages_costs.append(db.session.execute(db.select(Costs).filter_by(major_stage_id=stage.id)).scalars().first())
    
#         journey_costs = db.session.execute(db.select(Costs).filter_by(journey_id=journeyId)).scalars().first()
        
#     except:
#         return jsonify({'error': 'Unknown error'}, 400)
    
    
#     response, isValid = MajorStageValidation.validate_major_stage_update(major_stage, old_major_stage, existing_major_stages, existing_major_stages_costs, journey_costs)
    
#     if not isValid:
#         return jsonify({'majorStageFormValues': response, 'status': 400})
    
#     # Delete Minor Stages if Country is changed
#     if response['country']['value'] != old_major_stage.country:
#         if old_major_stage.minor_stages:
#             for minor_stage in old_major_stage.minor_stages:
#                 db.session.delete(minor_stage)
#             db.session.commit()
    
#     money_exceeded = int(response['budget']['value']) < int(response['spent_money']['value'])
    
#     minorStages_result = db.session.execute(db.select(MinorStage).filter_by(major_stage_id=majorStageId))
#     minorStages = minorStages_result.scalars().all()
#     minorStagesIds = [minorStage.id for minorStage in minorStages]
    
#     try:    
#         # Update the major_stage
#         db.session.execute(db.update(MajorStage).where(MajorStage.id == majorStageId).values(
#             title=major_stage['title']['value'],
#             done=major_stage['done']['value'],
#             scheduled_start_time=major_stage['scheduled_start_time']['value'],
#             scheduled_end_time=major_stage['scheduled_end_time']['value'],
#             additional_info=major_stage['additional_info']['value'],
#             country=major_stage['country']['value']
#         ))
#         db.session.commit()
        
#         # Update the costs for the major stage
#         db.session.execute(db.update(Costs).where(Costs.major_stage_id == majorStageId).values(
#             budget=major_stage['budget']['value'],
#             spent_money=major_stage['spent_money']['value'],
#             money_exceeded=money_exceeded
#         ))
#         db.session.commit()
        
#         major_stage_spendings = db.session.execute(db.select(Spendings).join(Costs).filter(Costs.major_stage_id == majorStageId)).scalars().all()
#         transportation = db.session.execute(db.select(Transportation).filter_by(major_stage_id=majorStageId)).scalars().first()
            
#         response_major_stage = {'id': majorStageId,
#                                 'title': major_stage['title']['value'],
#                                 'done': major_stage['done']['value'],
#                                 'scheduled_start_time': major_stage['scheduled_start_time']['value'],
#                                 'scheduled_end_time': major_stage['scheduled_end_time']['value'],
#                                 'additional_info': major_stage['additional_info']['value'],
#                                 'country': major_stage['country']['value'],
#                                 'costs': {
#                                     'budget': major_stage['budget']['value'],
#                                     'spent_money': major_stage['spent_money']['value'],
#                                     'money_exceeded': money_exceeded
#                                 },
#                                 'minorStagesIds': minorStagesIds}
        
#         if major_stage_spendings:
#             response_major_stage['costs']['spendings'] = [{'name': spending.name, 'amount': spending.amount, 'date': spending.date, 'category': spending.category} for spending in major_stage_spendings]
        
#         if transportation is not None:
#             response_major_stage['transportation'] = {
#                 'type': transportation.type,
#                 'start_time': transportation.start_time,
#                 'arrival_time': transportation.arrival_time,
#                 'place_of_departure': transportation.place_of_departure,
#                 'place_of_arrival': transportation.place_of_arrival,
#                 'transportation_costs': transportation.transportation_costs,
#                 'link': transportation.link,
#             }
        
#         return jsonify({'majorStage': response_major_stage,'status': 200})
#     except Exception as e:
#         return jsonify({'error': str(e)}, 500)
    
    
# @major_stage_bp.route('/delete-major-stage/<int:majorStageId>', methods=['DELETE'])
# @token_required
# def delete_major_stage(current_user, majorStageId):
#     try:        
#         major_stage = db.get_or_404(MajorStage, majorStageId)
#         db.session.delete(major_stage)
#         db.session.commit()
#         return jsonify({'status': 200})
#     except Exception as e:
#         return jsonify({'error': str(e)}, 500)
    