from flask import Blueprint, request, jsonify
from db import db
from countryinfo import CountryInfo
from app.models import CustomCountry, Journey, PlaceToVisit, JourneysCustomCountriesLink
from app.validation.country_validation import CountryValidation
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
        
        for custom_country in custom_countries:    
            places_to_visit = []   
            placesToVisit = PlaceToVisit.query.filter_by(custom_country_id=custom_country.id).all()
            if placesToVisit: 
                places = [{'id': place.id, 'name': place.name, 'description': place.description, 'visited': place.visited, 'favorite': place.favorite, 'link': place.link} for place in placesToVisit]
                places_to_visit += places
            
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
    

@country_bp.route('/get-custom-countries-by-journey/<int:journeyId>', methods=['GET'])
@token_required
def get_custom_countries_by_journey(current_user, journeyId):
    try:        
        result = db.session.execute(db.select(JourneysCustomCountriesLink).filter_by(journey_id=journeyId))
        link_result = result.scalars().all()
        countryIds = [link.custom_country_id for link in link_result]
        
        custom_countries = []
        
        for countryId in countryIds:
            custom_country = CustomCountry.query.filter_by(id=countryId).order_by(CustomCountry.name).first()
            custom_countries.append(custom_country)
        
        response_custom_countries = []
        
        for custom_country in custom_countries:    
            places_to_visit = []   
            placesToVisit = PlaceToVisit.query.filter_by(custom_country_id=custom_country.id).all()
            if placesToVisit: 
                places = [{'id': place.id, 'name': place.name, 'description': place.description, 'visited': place.visited, 'favorite': place.favorite, 'link': place.link} for place in placesToVisit]
                places_to_visit += places
            
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
        country_exists = CustomCountry.query.filter_by(name=country_name, user_id=current_user).first()
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
    

    
@country_bp.route('/update-custom-country/<int:customCountryId>', methods=['POST'])
@token_required
def update_country(current_user, customCountryId):
    try:
        country = request.get_json()
    except:
        return jsonify({'error': 'Unknown error'}, 400)
    
    response, isValid = CountryValidation.validate_custom_country_update(country=country)
    
    if not isValid:
        return jsonify({'customCountryFormValues': response, 'status': 400})
        
    try:
        # Update the country
        db.session.execute(db.update(CustomCountry).where(CustomCountry.id == customCountryId).values(
            visum_regulations=country['visum_regulations']['value'],
            best_time_to_visit=country['best_time_to_visit']['value'],
            general_information=country['general_information']['value'],
        ))
        db.session.commit()
            
        country = db.get_or_404(CustomCountry, customCountryId)
        response_country = {'id': country.id,
                            'name': country.name,
                            'code': country.code,
                            'timezones': country.timezones.split(',') if country.timezones else None,
                            'currencies': country.currencies.split(',') if country.currencies else None,
                            'languages': country.languages.split(',') if country.languages else None,
                            'capital': country.capital,
                            'population': country.population,
                            'region': country.region,
                            'subregion': country.subregion,
                            'wiki_link': country.wiki_link, 
                            'visited': country.visited,
                            'visum_regulations': country.visum_regulations,
                            'best_time_to_visit': country.best_time_to_visit,
                            'general_information': country.general_information
                            }
        
        return jsonify({'customCountry': response_country,'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)
        
    
    
@country_bp.route('/delete-custom-country/<int:customCountryId>', methods=['DELETE'])
@token_required
def delete_custom_country(current_user, customCountryId):
    try:
        countryName = CustomCountry.query.filter_by(id=customCountryId).first().name
        
        # Check if country is linked to a Journey
        result = db.session.execute(db.select(Journey).filter_by(user_id=current_user))
        journeys = result.scalars().all()
        for journey in journeys:
            countries = journey.countries.split(',')
            if countryName in countries:
                return jsonify({'error': f'Country is linked to a "{journey.name}". Please delete the Journey first.', 'status': 400})
        
        # Delete all Places To Visit aswell
        places = PlaceToVisit.query.filter_by(custom_country_id=customCountryId).all()
        for place in places:
            place_to_delete = db.get_or_404(PlaceToVisit, place.id)
            db.session.delete(place_to_delete)
        
        custom_country = db.get_or_404(CustomCountry, customCountryId)
        db.session.delete(custom_country)
        db.session.commit()
        return jsonify({'countryName': countryName, 'status': 200})
    except Exception as e:
        return jsonify({'error': str(e)}, 500)