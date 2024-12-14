from flask import Blueprint, request, jsonify
from db import db
from app.models import PlaceToVisit
from app.validation.place_validation import PlaceValidation
from app.routes.route_protection import token_required

place_bp = Blueprint('place-to-visit', __name__)

@place_bp.route('/get-places', methods=['GET'])
@token_required
def get_places(current_user):
    try:
        # Get all the journeys from the database
        result = db.session.execute(db.select(PlaceToVisit).filter_by(user_id=current_user))
        places = result.scalars().all()
        
        places_list = []
        for place in places:
            # Append the whole place, that matches the model from frontend to the list
            places_list.append({
                'countryId': place.custom_country_id,
                'id': place.id,
                'name': place.name,
                'description': place.description,
                'visited': place.visited,
                'favorite': place.favorite,
                'link': place.link,
                'maps_link': place.maps_link,
            })    
        return jsonify({'places': places_list, 'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    
@place_bp.route('/create-place', methods=['POST'])
@token_required
def create_place(current_user):
    try:
        place = request.get_json()
    except:
        return jsonify({'error': 'Unknown error'}, 400) 
    
    response, isValid = PlaceValidation.validate_place(place=place)
    
    if not isValid:
        return jsonify({'placeFormValues': response, 'status': 400})
    
    try:
        # Create a new place
        new_place = PlaceToVisit(
            custom_country_id=place['countryId']['value'],
            name=place['name']['value'],
            description=place['description']['value'],
            visited=place['visited']['value'],
            favorite=place['favorite']['value'],
            link=place['link']['value'],
            maps_link=place['maps_link']['value'],
            user_id=current_user
        )
        db.session.add(new_place)
        db.session.commit()
        
        
        response_place = {'id': new_place.id,
                'countryId': new_place.custom_country_id,
                'name': new_place.name,
                'description': new_place.description,
                'visited': new_place.visited,
                'favorite': new_place.favorite,
                'link': new_place.link,
                'maps_link': new_place.maps_link}
        
        return jsonify({'place': response_place,'status': 201})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    
    
# @journey_bp.route('/update-journey/<int:journeyId>', methods=['POST'])
# @token_required
# def update_journey(current_user, journeyId):
#     try:
#         journey = request.get_json()
#     except:
#         return jsonify({'error': 'Unknown error'}, 400)
    
#     response, isValid = JourneyValidation.validate_journey(journey=journey)
    
#     if not isValid:
#         return jsonify({'journeyFormValues': response, 'status': 400})
    
#     old_journey = db.get_or_404(Journey, journeyId)
#     money_exceeded = int(response['available_money']['value']) < int(response['planned_costs']['value'])
    
#     majorStages_result = db.session.execute(db.select(MajorStage).filter_by(journey_id=journeyId))
#     majorStages = majorStages_result.scalars().all()
#     majorStagesIds = [majorStage.id for majorStage in majorStages]
    
#     try:
#         # Update the journey
#         db.session.execute(db.update(Journey).where(Journey.id == journeyId).values(
#             name=journey['name']['value'],
#             description=journey['description']['value'],
#             scheduled_start_time=journey['scheduled_start_time']['value'],
#             scheduled_end_time=journey['scheduled_end_time']['value'],
#             countries=journey['countries']['value'][0],
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
        
    
    
# @journey_bp.route('/delete-journey/<int:journeyId>', methods=['DELETE'])
# @token_required
# def delete_journey(current_user, journeyId):
#     try:
#         # Delete the journey from the database
#         db.session.execute(db.delete(Journey).where(Journey.id == journeyId))
#         db.session.commit()
#         return jsonify({'status': 200})
#     except Exception as e:
#         return jsonify({'error': str(e)}, 500)