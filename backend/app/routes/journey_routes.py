from flask import Blueprint, request, jsonify
from db import db
from sqlalchemy import desc
from app.models import Journey, Costs, Spendings, MajorStage, MinorStage, CustomCountry, JourneysCustomCountriesLink, Transportation, Accommodation, Activity, PlaceToVisit
from app.validation.journey_validation import JourneyValidation
from app.routes.route_protection import token_required

journey_bp = Blueprint('journey', __name__)

@journey_bp.route('/get-journeys', methods=['GET'])
@token_required
def get_journeys(current_user):
    try:    
        # Get all the journeys from the database
        result = db.session.execute(db.select(Journey).filter_by(user_id=current_user).order_by(desc(Journey.scheduled_start_time)))
        journeys = result.scalars().all()
                
        # Fetch costs and major_stages for each journey
        journeys_list = []
        for journey in journeys:
            costs_result = db.session.execute(db.select(Costs).filter_by(journey_id=journey.id))
            costs = costs_result.scalars().first()
            spendings = db.session.execute(db.select(Spendings).filter_by(costs_id=costs.id)).scalars().all()
            
            majorStages_result = db.session.execute(db.select(MajorStage).filter_by(journey_id=journey.id))
            majorStages = majorStages_result.scalars().all()
            
            # Append the whole journey, that matches the model from frontend to the list
            journeys_list.append({
                'id': journey.id,
                'name': journey.name,
                'description': journey.description,
                'costs': {
                    'budget': costs.budget,
                    'spent_money': costs.spent_money,
                    'money_exceeded': costs.money_exceeded,
                    'spendings': [{'id': spending.id, 'name': spending.name, 'amount': spending.amount, 'date': spending.date, 'category': spending.category} for spending in spendings]
                },
                'scheduled_start_time': journey.scheduled_start_time,
                'scheduled_end_time': journey.scheduled_end_time,
                'countries': journey.countries,
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
        result = db.session.execute(db.select(Journey).filter_by(user_id=current_user))
        existing_journeys = result.scalars().all()
         
    except:
        return jsonify({'error': 'Unknown error'}, 400) 
    
    response, isValid = JourneyValidation.validate_journey(journey, existing_journeys)
    
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
            budget=journey['budget']['value'],
            spent_money=0,
            money_exceeded=False
        )
        
        db.session.add(costs)
        db.session.commit()
        
        # Add connection between journey and custom countries to the link table
        added_countries = journey['countries']['value'].split(', ')
        for country in added_countries:
            result = db.session.execute(db.select(CustomCountry).filter_by(name=country, user_id=current_user))
            custom_country = result.scalars().first()
            
            if custom_country:
                new_link = JourneysCustomCountriesLink(
                    journey_id=new_journey.id,
                    custom_country_id=custom_country.id
                )
                db.session.add(new_link)
                db.session.commit()
        
        # build response journey object for the frontend
        response_journey = {'id': new_journey.id,
                'name': new_journey.name,
                'description': new_journey.description,
                'costs': {
                    'budget': costs.budget,
                    'spent_money': costs.spent_money,
                    'money_exceeded': costs.money_exceeded,
                },
                'scheduled_start_time': new_journey.scheduled_start_time,
                'scheduled_end_time': new_journey.scheduled_end_time,
                'countries': new_journey.countries,
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
        result = db.session.execute(db.select(Journey).filter(Journey.id != journeyId, Journey.user_id==current_user))
        existing_journeys = result.scalars().all()
    except:
        return jsonify({'error': 'Unknown error'}, 400)
    
    
    response, isValid = JourneyValidation.validate_journey(journey, existing_journeys)
    
    # TODO: Check if affects major stages (then don't allow)
    
    if not isValid:
        return jsonify({'journeyFormValues': response, 'status': 400})
    
    
    old_journey = db.get_or_404(Journey, journeyId)
    
    money_exceeded = int(response['budget']['value']) < int(response['spent_money']['value'])
    
    majorStages_result = db.session.execute(db.select(MajorStage).filter_by(journey_id=journeyId))
    majorStages = majorStages_result.scalars().all()
    majorStagesIds = [majorStage.id for majorStage in majorStages]
    
    try:
        # Delete major stages that are not in the new journey, if former countries are not in the new countries
        current_countries = set(journey['countries']['value'].split(', '))
        former_countries = set(old_journey.countries.split(', '))
    
        if not former_countries.issubset(current_countries):
            missing_countries = former_countries - current_countries
            for delete_country in missing_countries:
                db.session.execute(db.delete(MajorStage).where(MajorStage.country == delete_country))
                db.session.commit()
                
                # Delete the connected entries from the link table
                result = db.session.execute(db.select(CustomCountry).filter_by(name=delete_country, user_id=current_user))
                delete_country_result = result.scalars().first()
                db.session.execute(db.delete(JourneysCustomCountriesLink).where(JourneysCustomCountriesLink.custom_country_id == delete_country_result.id))
                db.session.commit()
        
        # Add new countries to the link table
        added_countries = current_countries - former_countries
        for country in added_countries:
            result = db.session.execute(db.select(CustomCountry).filter_by(name=country, user_id=current_user))
            custom_country = result.scalars().first()
            
            if custom_country:
                new_link = JourneysCustomCountriesLink(
                    journey_id=journeyId,
                    custom_country_id=custom_country.id
                )
                db.session.add(new_link)
                db.session.commit()
            
        # Update the journey
        db.session.execute(db.update(Journey).where(Journey.id == journeyId).values(
            name=journey['name']['value'],
            description=journey['description']['value'],
            scheduled_start_time=journey['scheduled_start_time']['value'],
            scheduled_end_time=journey['scheduled_end_time']['value'],
            countries=journey['countries']['value'],
        ))
        db.session.commit()
        
        # Update the costs for the journey
        db.session.execute(db.update(Costs).where(Costs.journey_id == journeyId).values(
            budget=journey['budget']['value'],
            spent_money=journey['spent_money']['value'],
            money_exceeded=money_exceeded
        ))
        db.session.commit()
        
        journey_spendings = db.session.execute(db.select(Spendings).join(Costs).filter(Costs.journey_id == journeyId)).scalars().all()
            
        response_journey = {'id': journeyId,
                'name': journey['name']['value'],
                'description': journey['description']['value'],
                'costs': {
                    'budget': journey['budget']['value'],
                    'spent_money': journey['spent_money']['value'],
                    'money_exceeded': money_exceeded,
                },
                'scheduled_start_time': journey['scheduled_start_time']['value'],
                'scheduled_end_time': journey['scheduled_end_time']['value'],
                'countries': journey['countries']['value'],
                'done': old_journey.done,
                'majorStagesIds': majorStagesIds}
        
        if journey_spendings:
            response_journey['costs']['spendings'] = [{'id': spending.id, 'name': spending.name, 'amount': spending.amount, 'date': spending.date, 'category': spending.category} for spending in journey_spendings]
        
        return jsonify({'journey': response_journey,'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
        
    
    
@journey_bp.route('/delete-journey/<int:journeyId>', methods=['DELETE'])
@token_required
def delete_journey(current_user, journeyId):
    try:
        
        # TODO: Check if its the current journey in user, then delete there aswell
        
        # Delete connected entries in the link table
        journey = db.get_or_404(Journey, journeyId)
        countries = journey.countries.split(', ')
        for country in countries:
            result = db.session.execute(db.select(CustomCountry).filter_by(name=country, user_id=current_user))
            custom_country = result.scalars().first()
            
            if custom_country:
                db.session.execute(db.delete(JourneysCustomCountriesLink).where(JourneysCustomCountriesLink.journey_id == journeyId))
                db.session.commit()
        
        # Delete the journey from the database
        db.session.delete(journey)
        db.session.commit()
        return jsonify({'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
    
    
@journey_bp.route('/get-journeys-minor-stages-qty/<int:journeyId>', methods=['GET'])
@token_required
def get_journeys_minor_stages_qty(current_user, journeyId):
    major_stages = db.session.execute(db.select(MajorStage).filter_by(journey_id=journeyId)).scalars().all()
        
    if not major_stages:
        return jsonify({'status': 200, 'minorStagesQty': 0})
    
    minorStagesQty = 0
    for major_stage in major_stages:
        minor_stages = db.session.execute(db.select(MinorStage).filter_by(major_stage_id=major_stage.id)).scalars().all()
        minorStagesQty += len(minor_stages)
    return jsonify({'status': 200, 'minorStagesQty': minorStagesQty})
        

@journey_bp.route('/get-journeys-locations/<int:journeyId>', methods=['GET'])
@token_required
def get_journeys_locations(current_user, journeyId):
    try: 
        major_stages = db.session.execute(db.select(MajorStage).filter_by(journey_id=journeyId)).scalars().all()
        if not major_stages:
            return jsonify({'status': 200})
        
        locations = []
        majorStageNames = []
        for major_stage in major_stages:
            majorStageNames.append(major_stage.title)
            major_stage_transportation = db.session.execute(db.select(Transportation).filter_by(major_stage_id=major_stage.id)).scalars().first()
            if major_stage_transportation:
                if major_stage_transportation.departure_latitude and major_stage_transportation.departure_longitude:
                    locations.append({
                        'belonging': major_stage.title,
                        'locationType': 'transportation_departure',
                        'transportationType': major_stage_transportation.type.lower(),
                        'data': {
                            'name': major_stage_transportation.place_of_departure,
                            'latitude': major_stage_transportation.departure_latitude if major_stage_transportation.departure_latitude else None,
                            'longitude': major_stage_transportation.departure_longitude if major_stage_transportation.departure_longitude else None,
                        }
                    })   
                if major_stage_transportation.arrival_latitude and major_stage_transportation.arrival_longitude: 
                    locations.append({
                        'belonging': major_stage.title,
                        'locationType': 'transportation_arrival',
                        'transportationType': major_stage_transportation.type.lower(),
                        'data': {
                            'name': major_stage_transportation.place_of_arrival,
                            'latitude': major_stage_transportation.arrival_latitude if major_stage_transportation.arrival_latitude else None,
                            'longitude': major_stage_transportation.arrival_longitude if major_stage_transportation.arrival_longitude else None,
                        }
                    })
                
            minor_stages = db.session.execute(db.select(MinorStage).filter_by(major_stage_id=major_stage.id)).scalars().all()
            if minor_stages:
                for minor_stage in minor_stages:
                    minor_stage_transportation = db.session.execute(db.select(Transportation).filter_by(minor_stage_id=minor_stage.id)).scalars().first()
                    if minor_stage_transportation:
                        if minor_stage_transportation.departure_latitude and minor_stage_transportation.departure_longitude:
                                locations.append({
                                    'minorStageName': minor_stage.title,
                                    'belonging': major_stage.title,
                                    'locationType': 'transportation_departure',
                                    'transportationType': minor_stage_transportation.type.lower(),
                                    'data': {
                                        'name': minor_stage_transportation.place_of_departure,
                                        'latitude': minor_stage_transportation.departure_latitude if minor_stage_transportation.departure_latitude else None,
                                        'longitude': minor_stage_transportation.departure_longitude if minor_stage_transportation.departure_longitude else None,
                                    }
                                })
                        if minor_stage_transportation.arrival_latitude and minor_stage_transportation.arrival_longitude:
                            locations.append({
                                'minorStageName': minor_stage.title,
                                'belonging': major_stage.title,
                                'locationType': 'transportation_arrival',
                                'transportationType': minor_stage_transportation.type.lower(),
                                'data': {
                                    'name': minor_stage_transportation.place_of_arrival,
                                    'latitude': minor_stage_transportation.arrival_latitude if minor_stage_transportation.arrival_latitude else None,
                                    'longitude': minor_stage_transportation.arrival_longitude if minor_stage_transportation.arrival_longitude else None,
                                }
                            })
                    minor_stage_accommodation = db.session.execute(db.select(Accommodation).filter_by(minor_stage_id=minor_stage.id)).scalars().first()
                    if minor_stage_accommodation.latitude and minor_stage_accommodation.longitude:
                        locations.append({
                            'minorStageName': minor_stage.title,
                            'belonging': major_stage.title,
                            'locationType': 'accommodation',
                            'data': {
                                'name': minor_stage_accommodation.place,
                                'latitude': minor_stage_accommodation.latitude if minor_stage_accommodation.latitude else None,
                                'longitude': minor_stage_accommodation.longitude if minor_stage_accommodation.longitude else None,
                            }
                        })
                    activities = db.session.execute(db.select(Activity).filter_by(minor_stage_id=minor_stage.id)).scalars().all()
                    if activities:
                        for activity in activities:
                            if activity.latitude and activity.longitude:
                                locations.append({
                                    'minorStageName': minor_stage.title,
                                    'belonging': major_stage.title,
                                    'locationType': 'activity',
                                    'description': activity.description if len(activity.description) > 0 else None,
                                    'data': {
                                        'name': activity.place,
                                        'latitude': activity.latitude if activity.latitude else None,
                                        'longitude': activity.longitude if activity.longitude else None,
                                    }
                                })
                    places_to_visit = db.session.execute(db.select(PlaceToVisit).filter_by(minor_stage_id=minor_stage.id)).scalars().all()
                    if places_to_visit:
                        for place_to_visit in places_to_visit: 
                            if place_to_visit.latitude and place_to_visit.longitude:
                                locations.append({
                                    'minorStageName': minor_stage.title,
                                    'belonging': major_stage.title,
                                    'locationType': 'placeToVisit',
                                    'description': place_to_visit.description if len(place_to_visit.description) > 0 else None,
                                    'data': {
                                        'name': place_to_visit.name,
                                        'latitude': place_to_visit.latitude if place_to_visit.latitude else None,
                                        'longitude': place_to_visit.longitude if place_to_visit.longitude else None,
                                    }
                                })
        return jsonify({'status': 200, 'locations': locations, 'majorStageNames': majorStageNames})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)