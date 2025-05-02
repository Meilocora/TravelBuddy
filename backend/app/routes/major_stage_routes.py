from flask import Blueprint, jsonify, request
from app.routes.util import calculate_journey_costs
from sqlalchemy import desc
from db import db
from app.routes.route_protection import token_required
from app.models import Costs, Journey, Spendings, MajorStage, Transportation, MinorStage
from app.validation.major_stage_validation import MajorStageValidation

major_stage_bp = Blueprint('major_stage', __name__)

@major_stage_bp.route('/get-major-stages/<int:journeyId>', methods=['GET'])
@token_required
def get_major_stages(current_user, journeyId):
    try:
        # Get all the major stages from the database
        result = db.session.execute(db.select(MajorStage).filter_by(journey_id=journeyId).order_by(desc(MajorStage.scheduled_start_time)))
        majorStages = result.scalars().all()
        
        # Fetch costs, transportation and minor_stages for each major_stage
        major_stages_list = []
        for majorStage in majorStages:
            costs_result = db.session.execute(db.select(Costs).filter_by(major_stage_id=majorStage.id))
            costs = costs_result.scalars().first()
            spendings = db.session.execute(db.select(Spendings).filter_by(costs_id=costs.id)).scalars().all()
            
            transportation_result = db.session.execute(db.select(Transportation).filter_by(major_stage_id=majorStage.id))
            transportation = transportation_result.scalars().first()
            
            minorStages_result = db.session.execute(db.select(MinorStage).filter_by(major_stage_id=majorStage.id))
            minorStages = minorStages_result.scalars().all()
                        
            # Append the whole major stage, that matches the model from frontend to the list
            major_stage_data = {
                'id': majorStage.id,
                'title': majorStage.title,
                'country': majorStage.country,
                'done': majorStage.done,
                'scheduled_start_time': majorStage.scheduled_start_time,
                'scheduled_end_time': majorStage.scheduled_end_time,
                'additional_info': majorStage.additional_info,
                'costs': {
                    'budget': costs.budget,
                    'spent_money': costs.spent_money,
                    'money_exceeded': costs.money_exceeded,
                }
            }
            
            if transportation is not None:
                major_stage_data['transportation'] = {
                    'id': transportation.id,
                    'type': transportation.type,
                    'start_time': transportation.start_time,
                    'arrival_time': transportation.arrival_time,
                    'place_of_departure': transportation.place_of_departure,
                    'departure_latitude': transportation.departure_latitude if transportation.departure_latitude else None,
                    'departure_longitude': transportation.departure_longitude if transportation.departure_longitude else None,
                    'place_of_arrival': transportation.place_of_arrival,
                    'arrival_latitude': transportation.arrival_latitude if transportation.arrival_latitude else None,
                    'arrival_longitude': transportation.arrival_longitude if transportation.arrival_longitude else None,
                    'transportation_costs': transportation.transportation_costs,
                    'link': transportation.link,
                }
            
            # TODO: Maybe allow spendings for majorStages aswell?
            if spendings is not None:
                major_stage_data['costs']['spendings'] = [{'id': spending.id, 'name': spending.name, 'amount': spending.amount, 'date': spending.date, 'category': spending.category} for spending in spendings]
            
            if minorStages is not None:
                major_stage_data['minorStagesIds'] = [minorStage.id for minorStage in minorStages]
                
            major_stages_list.append(major_stage_data)
        
        return jsonify({'majorStages': major_stages_list, 'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    

@major_stage_bp.route('/create-major-stage/<int:journeyId>', methods=['POST'])
@token_required
def create_major_stage(current_user, journeyId):
    try:
        major_stage = request.get_json()
        result = db.session.execute(db.select(MajorStage).filter_by(journey_id=journeyId))
        existing_major_stages = result.scalars().all()
        
        existing_major_stages_costs = []
        for stage in existing_major_stages:
            existing_major_stages_costs.append(db.session.execute(db.select(Costs).filter_by(major_stage_id=stage.id)).scalars().first())
        
        journey_costs = db.session.execute(db.select(Costs).filter_by(journey_id=journeyId)).scalars().first()
         
    except:
        return jsonify({'error': 'Unknown error'}, 400) 
    
    response, isValid = MajorStageValidation.validate_major_stage(major_stage, existing_major_stages, existing_major_stages_costs, journey_costs)
    
    if not isValid:
        return jsonify({'majorStageFormValues': response, 'status': 400})
    
    try:
        # Create a new major stage
        new_major_stage = MajorStage(
            title=major_stage['title']['value'],
            done=False,
            scheduled_start_time=major_stage['scheduled_start_time']['value'],
            scheduled_end_time=major_stage['scheduled_end_time']['value'],
            additional_info=major_stage['additional_info']['value'],
            country=major_stage['country']['value'],
            journey_id=journeyId
        )
        db.session.add(new_major_stage)
        db.session.commit()
         
        # Create a new costs for the major stage
        costs = Costs(
            major_stage_id=new_major_stage.id,
            budget=major_stage['budget']['value'],
            spent_money=0,
            money_exceeded=False
        )
        db.session.add(costs)
        db.session.commit()
        
        # build response major stage object for the frontend
        response_major_stage = {'id': new_major_stage.id,
                                'title': new_major_stage.title,
                                'done': new_major_stage.done,
                                'scheduled_start_time': new_major_stage.scheduled_start_time,
                                'scheduled_end_time': new_major_stage.scheduled_end_time,
                                'additional_info': new_major_stage.additional_info,
                                'country': new_major_stage.country,
                                'costs': {
                                    'budget': costs.budget,
                                    'spent_money': costs.spent_money,
                                    'money_exceeded': costs.money_exceeded
                                },  
                                'minorStagesIds': []}
        
        return jsonify({'majorStage': response_major_stage,'status': 201})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    
    
@major_stage_bp.route('/update-major-stage/<int:journeyId>/<int:majorStageId>', methods=['POST'])
@token_required
def update_major_stage(current_user, journeyId, majorStageId):
    try:
        major_stage = request.get_json()
        result = db.session.execute(db.select(MajorStage).filter(MajorStage.id != majorStageId, MajorStage.journey_id==journeyId))
        existing_major_stages = result.scalars().all()
        old_major_stage = db.get_or_404(MajorStage, majorStageId)
    
        existing_major_stages_costs = []
        for stage in existing_major_stages:
            existing_major_stages_costs.append(db.session.execute(db.select(Costs).filter_by(major_stage_id=stage.id)).scalars().first())
    
        journey_costs = db.session.execute(db.select(Costs).filter_by(journey_id=journeyId)).scalars().first()
        
    except:
        return jsonify({'error': 'Unknown error'}, 400)
    
    
    response, isValid = MajorStageValidation.validate_major_stage_update(major_stage, old_major_stage, existing_major_stages, existing_major_stages_costs, journey_costs)
    
    if not isValid:
        return jsonify({'majorStageFormValues': response, 'status': 400})
    
    # Delete Minor Stages if Country is changed
    if response['country']['value'] != old_major_stage.country:
        if old_major_stage.minor_stages:
            for minor_stage in old_major_stage.minor_stages:
                db.session.delete(minor_stage)
            db.session.commit()
    
    money_exceeded = int(response['budget']['value']) < int(response['spent_money']['value'])
    
    minorStages_result = db.session.execute(db.select(MinorStage).filter_by(major_stage_id=majorStageId))
    minorStages = minorStages_result.scalars().all()
    minorStagesIds = [minorStage.id for minorStage in minorStages]
    
    major_stage_spendings = db.session.execute(db.select(Spendings).join(Costs).filter(Costs.major_stage_id == majorStageId)).scalars().all()
    transportation = db.session.execute(db.select(Transportation).filter_by(major_stage_id=majorStageId)).scalars().first()
    
    try:    
        # Update the major_stage
        db.session.execute(db.update(MajorStage).where(MajorStage.id == majorStageId).values(
            title=major_stage['title']['value'],
            done=major_stage['done']['value'],
            scheduled_start_time=major_stage['scheduled_start_time']['value'],
            scheduled_end_time=major_stage['scheduled_end_time']['value'],
            additional_info=major_stage['additional_info']['value'],
            country=major_stage['country']['value']
        ))
        db.session.commit()
        
        # Update the costs for the major stage
        db.session.execute(db.update(Costs).where(Costs.major_stage_id == majorStageId).values(
            budget=major_stage['budget']['value'],
            spent_money=major_stage['spent_money']['value'],
            money_exceeded=money_exceeded
        ))
        db.session.commit()
        
        response_major_stage = {'id': majorStageId,
                                'title': major_stage['title']['value'],
                                'done': major_stage['done']['value'],
                                'scheduled_start_time': major_stage['scheduled_start_time']['value'],
                                'scheduled_end_time': major_stage['scheduled_end_time']['value'],
                                'additional_info': major_stage['additional_info']['value'],
                                'country': major_stage['country']['value'],
                                'costs': {
                                    'budget': major_stage['budget']['value'],
                                    'spent_money': major_stage['spent_money']['value'],
                                    'money_exceeded': money_exceeded
                                },
                                'minorStagesIds': minorStagesIds}
        
        if major_stage_spendings:
            response_major_stage['costs']['spendings'] = [{'name': spending.name, 'amount': spending.amount, 'date': spending.date, 'category': spending.category} for spending in major_stage_spendings]
        
        if transportation is not None:
            response_major_stage['transportation'] = {
                'type': transportation.type,
                'start_time': transportation.start_time,
                'arrival_time': transportation.arrival_time,
                'place_of_departure': transportation.place_of_departure,
                'place_of_arrival': transportation.place_of_arrival,
                'transportation_costs': transportation.transportation_costs,
                'link': transportation.link,
            }
        
        return jsonify({'majorStage': response_major_stage,'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    
    
@major_stage_bp.route('/delete-major-stage/<int:majorStageId>', methods=['DELETE'])
@token_required
def delete_major_stage(current_user, majorStageId):
    journey = db.session.execute(db.select(Journey).join(MajorStage).filter(MajorStage.id == majorStageId)).scalars().first()
    journey_costs = db.session.execute(db.select(Costs).filter_by(journey_id=journey.id)).scalars().first()
    try:        
        major_stage = db.get_or_404(MajorStage, majorStageId)
        db.session.delete(major_stage)
        db.session.commit()
        
        calculate_journey_costs(journey_costs)
        
        return jsonify({'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    