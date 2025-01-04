from flask import Blueprint, jsonify
from app.routes.route_protection import token_required
from db import db
from app.models import Costs, MajorStage, Transportation, MinorStage

major_stage_bp = Blueprint('major_stage', __name__)

@major_stage_bp.route('/get-major-stages/<int:journeyId>', methods=['GET'])
@token_required
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
    
#     @journey_bp.route('/create-journey', methods=['POST'])
# @token_required
# def create_journey(current_user):
#     try:
#         journey = request.get_json()
#     except:
#         return jsonify({'error': 'Unknown error'}, 400) 
    
#     response, isValid = JourneyValidation.validate_journey(journey=journey)
    
#     # TODO: Check if overlaps with another Major Stage
      # TODO: Check if is inside Journey 
      # TODO: Costs can't be higher than planned money of journey
    
#     if not isValid:
#         return jsonify({'journeyFormValues': response, 'status': 400})
    
    
    
#     try:
#         # Create a new journey
#         new_journey = Journey(
#             name=journey['name']['value'],
#             description=journey['description']['value'],
#             scheduled_start_time=journey['scheduled_start_time']['value'],
#             scheduled_end_time=journey['scheduled_end_time']['value'],
#             countries=journey['countries']['value'],
#             done=False,
#             user_id=current_user
#         )
         
#         db.session.add(new_journey)
#         db.session.commit()
         
#         # Create a new costs for the journey
#         costs = Costs(
#             journey_id=new_journey.id,
#             available_money=journey['available_money']['value'],
#             planned_costs=0,
#             money_exceeded=False
#         )
        
#         db.session.add(costs)
#         db.session.commit()
        
#         response_journey = {'id': new_journey.id,
#                 'name': new_journey.name,
#                 'description': new_journey.description,
#                 'costs': {
#                     'available_money': costs.available_money,
#                     'planned_costs': costs.planned_costs,
#                     'money_exceeded': costs.money_exceeded,
#                 },
#                 'scheduled_start_time': new_journey.scheduled_start_time,
#                 'scheduled_end_time': new_journey.scheduled_end_time,
#                 'countries': new_journey.countries.split(', '),
#                 'done': new_journey.done,
#                 'majorStagesIds': []}
        
#         return jsonify({'journey': response_journey,'status': 201})
#     except Exception as e:
#         return jsonify({'error': str(e)}, 500)
    
# @journey_bp.route('/update-journey/<int:journeyId>', methods=['POST'])
# @token_required
# def update_journey(current_user, journeyId):
#     try:
#         journey = request.get_json()
#     except:
#         return jsonify({'error': 'Unknown error'}, 400)
    
#     response, isValid = JourneyValidation.validate_journey(journey=journey)
    
#     # TODO: Check if overlaps with another major Stage
      # TODO: Check if is still inside Journey
#     # TODO: Check if change of dates affects minor stages (then don't allow)
      # TODO: Check if costs still in budget of Journey
    
#     if not isValid:
#         return jsonify({'journeyFormValues': response, 'status': 400})
    
    
#     old_journey = db.get_or_404(Journey, journeyId)
    
#     money_exceeded = int(response['available_money']['value']) < int(response['planned_costs']['value'])
    
#     majorStages_result = db.session.execute(db.select(MajorStage).filter_by(journey_id=journeyId))
#     majorStages = majorStages_result.scalars().all()
#     majorStagesIds = [majorStage.id for majorStage in majorStages]
    
#     try:
#         # Delete major stages that are not in the new journey, if former countries are not in the new countries
#         current_countries = set(journey['countries']['value'].split(', '))
#         former_countries = set(old_journey.countries.split(', '))
    
#         if not former_countries.issubset(current_countries):
#             missing_countries = former_countries - current_countries
#             for delete_country in missing_countries:
#                 db.session.execute(db.delete(MajorStage).where(MajorStage.country == delete_country))
#                 db.session.commit()
            
#         # Update the journey
#         db.session.execute(db.update(Journey).where(Journey.id == journeyId).values(
#             name=journey['name']['value'],
#             description=journey['description']['value'],
#             scheduled_start_time=journey['scheduled_start_time']['value'],
#             scheduled_end_time=journey['scheduled_end_time']['value'],
#             countries=journey['countries']['value'],
#         ))
#         db.session.commit()
        
#         # Update the costs for the journey
#         db.session.execute(db.update(Costs).where(Costs.journey_id == journeyId).values(
#             available_money=journey['available_money']['value'],
#             planned_costs=journey['planned_costs']['value'],
#             money_exceeded=money_exceeded
#         ))
#         db.session.commit()
            
#         response_journey = {'id': journeyId,
#                 'name': journey['name']['value'],
#                 'description': journey['description']['value'],
#                 'costs': {
#                     'available_money': journey['available_money']['value'],
#                     'planned_costs': journey['planned_costs']['value'],
#                     'money_exceeded': money_exceeded,
#                 },
#                 'scheduled_start_time': journey['scheduled_start_time']['value'],
#                 'scheduled_end_time': journey['scheduled_end_time']['value'],
#                 'countries': journey['countries']['value'],
#                 'done': old_journey.done,
#                 'majorStagesIds': majorStagesIds}
        
#         return jsonify({'journey': response_journey,'status': 200})
#     except Exception as e:
#         return jsonify({'error': str(e)}, 500)
        
    
    
@major_stage_bp.route('/delete-major-stage/<int:majorStageId>', methods=['DELETE'])
@token_required
def delete_major_stage(current_user, majorStageId):
    try:        
#         # TODO: Check for minor stages to delete aswell (or will delete cause of database structure?) 
        
        db.session.execute(db.delete(MajorStage).where(MajorStage.id == majorStageId))
        db.session.commit()
        return jsonify({'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)