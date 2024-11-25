from flask import Blueprint, request, jsonify
from db import db
from countryinfo import CountryInfo
from app.models import CustomCountry
from app.routes.route_protection import token_required
import re

country_bp = Blueprint('country', __name__)

@country_bp.route('/get-countries/<string:country_name>', methods=['GET'])
@token_required
def get_countries(current_user, country_name):
    try:
        all_countries = CountryInfo().all().keys()
        search_term = country_name.lower()
        countries_list = []
        regex = re.compile(f".*{search_term}.*")
        
        for country in all_countries:
            if re.match(regex, country):
                if country.startswith(search_term):
                    countries_list.insert(0, country.capitalize())
                else:
                    countries_list.append(country.capitalize())             
        
        return jsonify({'countries': countries_list, 'status': 200})
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500})


@country_bp.route('/create-custom-country', methods=['POST'])
@token_required
def create_custom_country(current_user):
    try:
        country_name = request.get_json()['countryName']
        
        
        country = CustomCountry.query.filter_by(name=country_name).first()
        if country:
            return jsonify({'error': 'Country already exists', 'status': 400})
        
        # TODO: Check if it is a valid country
        
        print(country_name)
        # new_country = CustomCountry(name=country_name)
        # db.session.add(new_country)
        # db.session.commit()
        
        return jsonify({'status': 201})
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500})
    
    
    
# @journey_bp.route('/create-journey', methods=['POST'])
# @token_required
# def create_journey(current_user):
#     try:
#         journey = request.get_json()
#     except:
#         return jsonify({'error': 'Unknown error'}, 400) 
    
#     response, isValid = JourneyValidation.validate_journey(journey=journey)
    
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
        
#         print(new_journey)
        
        
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
#                 'countries': new_journey.countries.split(','),
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