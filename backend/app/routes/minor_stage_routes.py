from flask import Blueprint, jsonify, request
from db import db
from app.routes.route_protection import token_required
from app.models import Costs, Spendings, MinorStage, Transportation, Accommodation, Activity, PlaceToVisit
from app.validation.minor_stage_validation import MinorStageValidation

minor_stage_bp = Blueprint('minor_stage', __name__)

@minor_stage_bp.route('/get-minor-stages/<int:majorStageId>', methods=['GET'])
@token_required
def get_minor_stages(current_user, majorStageId):
    try:
        # Get all the minor stages from the database
        result = db.session.execute(db.select(MinorStage).filter_by(major_stage_id=majorStageId).order_by(MinorStage.scheduled_start_time))
        minorStages = result.scalars().all()
        
        # Fetch costs, transportation, accommodation, activities and places_to_visit for each minor_stage
        minor_stages_list = []
        for minorStage in minorStages:
            costs_result = db.session.execute(db.select(Costs).filter_by(minor_stage_id=minorStage.id))
            costs = costs_result.scalars().first()
            spendings = db.session.execute(db.select(Spendings).filter_by(costs_id=costs.id)).scalars().all()
            
            transportation_result = db.session.execute(db.select(Transportation).filter_by(minor_stage_id=minorStage.id))
            transportation = transportation_result.scalars().first()
            
            accommodation_result = db.session.execute(db.select(Accommodation).filter_by(minor_stage_id=minorStage.id))
            accommodation = accommodation_result.scalars().first()
            
            activities_result = db.session.execute(db.select(Activity).filter_by(minor_stage_id=minorStage.id))
            activities = activities_result.scalars().all()
            
            places_to_visit_result = db.session.execute(db.select(PlaceToVisit).filter_by(minor_stage_id=minorStage.id))
            places_to_visit = places_to_visit_result.scalars().all()
                        
            # Append the whole minor stage, that matches the model from frontend to the list
            minor_stage_data = {
                'id': minorStage.id,
                'title': minorStage.title,
                'scheduled_start_time': minorStage.scheduled_start_time,
                'scheduled_end_time': minorStage.scheduled_end_time,
                'done': minorStage.done,
                'costs': {
                    'budget': costs.budget,
                    'spent_money': costs.spent_money,
                    'money_exceeded': costs.money_exceeded,
                },
            }
            
            if transportation is not None:
                minor_stage_data['transportation'] = {
                  'type': transportation.type,
                    'start_time': transportation.start_time,
                    'arrival_time': transportation.arrival_time,
                    'place_of_departure': transportation.place_of_departure,
                    'place_of_arrival': transportation.place_of_arrival,
                    'transportation_costs': transportation.transportation_costs,
                    'link': transportation.link,
                }
                
            if spendings is not None:
                minor_stage_data['costs']['spendings'] = [{'name': spending.name, 'amount': spending.amount, 'date': spending.date, 'category': spending.category} for spending in spendings]
            
            if accommodation is not None:
                minor_stage_data['accommodation'] = {
                    'name': accommodation.name,
                    'description': accommodation.description,
                    'place': accommodation.place,
                    'costs': accommodation.costs,
                    'booked': accommodation.booked,
                    'link': accommodation.link,
                }
            
            if activities is not None:
                minor_stage_data['activities'] = [{'name': activity.name, 'description': activity.description, 'costs': activity.costs, 'booked': activity.booked, 'place': activity.place, 'link': activity.link} for activity in activities]
            
            if places_to_visit is not None:
                minor_stage_data['placesToVisit'] = [{'name': place_to_visit.name, 'description': place_to_visit.description, 'visited': place_to_visit.visited, 'favorite': place_to_visit.favorite, 'link': place_to_visit.link} for place_to_visit in places_to_visit]
            
            minor_stages_list.append(minor_stage_data)
        
        return jsonify({'minorStages': minor_stages_list, 'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    

@minor_stage_bp.route('/create-minor-stage/<int:majorStageId>', methods=['POST'])
@token_required
def create_minor_stage(current_user, majorStageId):
    try:
        minor_stage = request.get_json()
        result = db.session.execute(db.select(MinorStage).filter_by(major_stage_id=majorStageId))
        existing_minor_stages = result.scalars().all()
         
    except:
        return jsonify({'error': 'Unknown error'}, 400) 
    
    response, isValid = MinorStageValidation.validate_major_stage(minor_stage, existing_minor_stages)
    
    if not isValid:
        return jsonify({'minorStageFormValues': response, 'status': 400})
    
    try:
        # Create a new minor stage
        new_minor_stage = MinorStage(
            title=minor_stage['title']['value'],
            done=False,
            scheduled_start_time=minor_stage['scheduled_start_time']['value'],
            scheduled_end_time=minor_stage['scheduled_end_time']['value'],
            major_stage_id=majorStageId
        )
        db.session.add(new_minor_stage)
        db.session.commit()
         
        # Create a new costs for the major stage
        costs = Costs(
            minor_stage_id=new_minor_stage.id,
            budget=0,
            spent_money=0,
            money_exceeded=False
        )
        db.session.add(costs)
        db.session.commit()
        
        # build response major stage object for the frontend
        response_minor_stage = {'id': new_minor_stage.id,
                                'title': new_minor_stage.title,
                                'done': new_minor_stage.done,
                                'scheduled_start_time': new_minor_stage.scheduled_start_time,
                                'scheduled_end_time': new_minor_stage.scheduled_end_time,
                                'costs': {
                                    'budget': costs.budget,
                                    'spent_money': costs.spent_money,
                                    'money_exceeded': costs.money_exceeded
                                },  
                                }
        
        return jsonify({'minorStage': response_minor_stage,'status': 201})
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
    

@minor_stage_bp.route('/delete-minor-stage/<int:minorStageId>', methods=['DELETE'])
@token_required
def delete_minor_stage(current_user, minorStageId):
    # minor_stage = db.session.execute(db.select().join(MajorStage).filter(MajorStage.id == majorStageId)).scalars().first()
    # journey_costs = db.session.execute(db.select(Costs).filter_by(journey_id=journey.id)).scalars().first()
    # try:        
    #     major_stage = db.get_or_404(MajorStage, majorStageId)
    #     db.session.delete(major_stage)
    #     db.session.commit()
        
    #     calculate_journey_costs(journey_costs)
        
    #     return jsonify({'status': 200})
    # except Exception as e:
    #     return jsonify({'error': str(e)}, 500)
    pass
    
# TODO: Add feature to enter additional spent money + title (new database table, that is child to minor stage)