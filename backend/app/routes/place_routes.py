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
    
    
@place_bp.route('/update-place/<int:placeId>', methods=['POST'])
@token_required
def update_journey(current_user, placeId):
    try:
        place = request.get_json()
    except:
        return jsonify({'error': 'Unknown error'}, 400)
    
    old_place = db.get_or_404(PlaceToVisit, placeId)
    
    response, isValid = PlaceValidation.validate_place(place=place)
    
    if not isValid:
        return jsonify({'placeFormValues': response, 'status': 400})
        
    try:
        # Update the place
        db.session.execute(db.update(PlaceToVisit).where(PlaceToVisit.id == placeId).values(
            name=place['name']['value'],
            description=place['description']['value'],
            visited=place['visited']['value'],
            favorite=place['favorite']['value'],
            link=place['link']['value'],
            maps_link=place['maps_link']['value'],
        ))
        db.session.commit()
        
        response_place = {'id': old_place.id,
                'countryId': old_place.custom_country_id,
                'name': place['name']['value'],
                'description': place['description']['value'],
                'visited': place['visited']['value'],
                'favorite': place['favorite']['value'],
                'link': place['link']['value'],
                'maps_link': place['maps_link']['value']
                }
        
        
        return jsonify({'place': response_place,'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
        
    
    
@place_bp.route('/delete-place/<int:placeId>', methods=['DELETE'])
@token_required
def delete_place(current_user, placeId):
    try:
        # Delete the place from the database
        db.session.execute(db.delete(PlaceToVisit).where(PlaceToVisit.id == placeId))
        db.session.commit()
        return jsonify({'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    
@place_bp.route('/toggle-favorite-place/<int:placeId>', methods=['POST'])
@token_required
def toggle_favorite_place(current_user, placeId):
    try:
        
        old_place = db.get_or_404(PlaceToVisit, placeId)
        
        # Update the place
        db.session.execute(db.update(PlaceToVisit).where(PlaceToVisit.id == placeId).values(
            favorite = not old_place.favorite
        ))
        db.session.commit()

        return jsonify({'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    
@place_bp.route('/toggle-visited-place/<int:placeId>', methods=['POST'])
@token_required
def toggle_visited_place(current_user, placeId):
    try:
        old_place = db.get_or_404(PlaceToVisit, placeId)
        
        # Update the place
        db.session.execute(db.update(PlaceToVisit).where(PlaceToVisit.id == placeId).values(
            visited = not old_place.visited
        ))
        db.session.commit()
        return jsonify({'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)