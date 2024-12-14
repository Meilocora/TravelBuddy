from flask import Blueprint, request, jsonify
from db import db
from app.models import Journey, Costs, MajorStage
from app.validation.journey_validation import JourneyValidation
from app.routes.route_protection import token_required

journey_bp = Blueprint('journey', __name__)

@journey_bp.route('/get-journeys', methods=['GET'])
@token_required
def get_journeys(current_user):
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
    
@journey_bp.route('/create-journey', methods=['POST'])
@token_required
def create_journey(current_user):
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
            done=False,
            user_id=current_user
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
        
        return jsonify({'journey': response_journey,'status': 201})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    
@journey_bp.route('/update-journey/<int:journeyId>', methods=['POST'])
@token_required
def update_journey(current_user, journeyId):
    try:
        journey = request.get_json()
    except:
        return jsonify({'error': 'Unknown error'}, 400)
    
    response, isValid = JourneyValidation.validate_journey(journey=journey)
    
    if not isValid:
        return jsonify({'journeyFormValues': response, 'status': 400})
    
    old_journey = db.get_or_404(Journey, journeyId)
    money_exceeded = int(response['available_money']['value']) < int(response['planned_costs']['value'])
    
    majorStages_result = db.session.execute(db.select(MajorStage).filter_by(journey_id=journeyId))
    majorStages = majorStages_result.scalars().all()
    majorStagesIds = [majorStage.id for majorStage in majorStages]
    
    try:
        # Update the journey
        db.session.execute(db.update(Journey).where(Journey.id == journeyId).values(
            name=journey['name']['value'],
            description=journey['description']['value'],
            scheduled_start_time=journey['scheduled_start_time']['value'],
            scheduled_end_time=journey['scheduled_end_time']['value'],
            countries=journey['countries']['value'][0],
        ))
        db.session.commit()
        
        # Update the costs for the journey
        db.session.execute(db.update(Costs).where(Costs.journey_id == journeyId).values(
            available_money=journey['available_money']['value'],
            planned_costs=journey['planned_costs']['value'],
            money_exceeded=money_exceeded
        ))
        db.session.commit()
            
        response_journey = {'id': journeyId,
                'name': journey['name']['value'],
                'description': journey['description']['value'],
                'costs': {
                    'available_money': journey['available_money']['value'],
                    'planned_costs': journey['planned_costs']['value'],
                    'money_exceeded': money_exceeded,
                },
                'scheduled_start_time': journey['scheduled_start_time']['value'],
                'scheduled_end_time': journey['scheduled_end_time']['value'],
                'countries': journey['countries']['value'],
                'done': old_journey.done,
                'majorStagesIds': majorStagesIds}
        
        return jsonify({'journey': response_journey,'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
        
    
    
@journey_bp.route('/delete-journey/<int:journeyId>', methods=['DELETE'])
@token_required
def delete_journey(current_user, journeyId):
    try:
        # Delete the journey from the database
        db.session.execute(db.delete(Journey).where(Journey.id == journeyId))
        db.session.commit()
        return jsonify({'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)