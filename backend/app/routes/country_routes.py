from flask import Blueprint, request, jsonify
from db import db
from countryinfo import CountryInfo
from app.models import CustomCountry, PlaceToVisit
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
    

@country_bp.route('/get-custom-countries', methods=['GET'])
@token_required
def get_custom_countries(current_user):
    try:
        custom_countries = CustomCountry.query.filter_by(user_id=current_user).order_by(CustomCountry.name).all()
        response_custom_countries = []
        
        places_to_visit = []
        for custom_country in custom_countries:       
            placesToVisit = PlaceToVisit.query.filter_by(custom_country_id=custom_country.id).all()
            if placesToVisit: 
                places = [{'id': place.id, 'name': place.name, 'description': place.description, 'visited': place.visited, 'favorite': place.favorite, 'link': place.link} for place in placesToVisit]
                places_to_visit += places
            
        
        for custom_country in custom_countries:
            response_custom_countries.append({'id': custom_country.id,
                                              'name': custom_country.name,
                                              'code': custom_country.code,
                                              'timezones': custom_country.timezones.split(',') if custom_country.timezones else None, 
                                              'currencies': custom_country.currencies.split(',') if custom_country.currencies else None,
                                              'languages': custom_country.languages.split(',') if custom_country.languages else None,
                                              'capital': custom_country.capital,
                                              'population': custom_country.population,
                                              'region': custom_country.region,
                                              'subregion': custom_country.subregion,
                                              'wiki_link': custom_country.wiki_link, 
                                              'visited': custom_country.visited,
                                              'visum_regulations': custom_country.visum_regulations,
                                                'best_time_to_visit': custom_country.best_time_to_visit,
                                                'general_information': custom_country.general_information,
                                                'placesToVisit': places_to_visit
                                              })
        
        return jsonify({'customCountries': response_custom_countries, 'status': 200})
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500})


@country_bp.route('/create-custom-country', methods=['POST'])
@token_required
def create_custom_country(current_user):
    try:
        country_name = request.get_json()['countryName']
        country_exists = CustomCountry.query.filter_by(name=country_name).first()
        if country_exists:
            return jsonify({'error': 'Country already exists', 'status': 400})
        
        if country_name.lower() not in CountryInfo().all().keys():
            return jsonify({'error': 'Country does not exist', 'status': 400})
        else:
            countryInfo = CountryInfo(country_name)
            
            new_country = CustomCountry(
                name=country_name,
                code = countryInfo.iso(3) if countryInfo.iso(3) else None,
                timezones = ', '.join(countryInfo.timezones()) if countryInfo.timezones() else None, 
                currencies = ', '.join(countryInfo.currencies()) if countryInfo.currencies() else None,
                languages = ', '.join(countryInfo.languages()) if countryInfo.languages() else None,
                capital = countryInfo.capital() if countryInfo.capital() else None,
                population = countryInfo.population() if countryInfo.population() else None,
                region = countryInfo.region() if countryInfo.region() else None,
                subregion = countryInfo.subregion() if countryInfo.subregion() else None,
                wiki_link = countryInfo.wiki() if countryInfo.wiki() else None,
                visited = False,
                visum_regulations = None,
                best_time_to_visit = None,
                general_information = None,
                user_id = current_user,
                major_stage_id = None
            )
            
            db.session.add(new_country)
            db.session.commit()
            
            response_country = {'id': new_country.id,
                                'name': new_country.name,
                                'code': new_country.code,
                                'timezones': new_country.timezones.split(',') if new_country.timezones else None,
                                'currencies': new_country.currencies.split(',') if new_country.currencies else None,
                                'languages': new_country.languages.split(',') if new_country.languages else None,
                                'capital': new_country.capital,
                                'population': new_country.population,
                                'region': new_country.region,
                                'subregion': new_country.subregion,
                                'wiki_link': new_country.wiki_link, 
                                }
        
        return jsonify({'customCountry': response_country,'status': 201})
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500})
    

    
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