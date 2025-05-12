from db import db
from app.models import Journey, Costs, Spendings, MajorStage, MinorStage, CustomCountry, JourneysCustomCountriesLink, Transportation, Accommodation, Activity, PlaceToVisit
from app.routes.util import parseDate, formatDateToString, parseDateTime, formatDateTimeToString


def fetch_journeys(current_user):
    try:    
        # Get all the journeys from the database
        result = db.session.execute(db.select(Journey).filter_by(user_id=current_user).order_by(Journey.scheduled_start_time))
        journeys = result.scalars().all()
                
        # Fetch costs and major_stages for each journey
        journeys_list = []
        for journey in journeys:
            costs_result = db.session.execute(db.select(Costs).filter_by(journey_id=journey.id))
            costs = costs_result.scalars().first()
            spendings = db.session.execute(db.select(Spendings).filter_by(costs_id=costs.id)).scalars().all()
            
            majorStages = db.session.execute(db.select(MajorStage).filter_by(journey_id=journey.id)).scalars().all()
            
            # Append the whole journey, that matches the model from frontend to the list
            journey_data = {
                'id': journey.id,
                'name': journey.name,
                'description': journey.description,
                'costs': {
                    'budget': costs.budget,
                    'spent_money': costs.spent_money,
                    'money_exceeded': costs.money_exceeded,
                    'spendings': [{'id': spending.id, 'name': spending.name, 'amount': spending.amount, 'date': formatDateToString(spending.date), 'category': spending.category} for spending in spendings]
                },
                'scheduled_start_time': formatDateToString(journey.scheduled_start_time),
                'scheduled_end_time': formatDateToString(journey.scheduled_end_time),
                # TODO: This must be a real customCountry
                'countries': journey.countries,
                'done': journey.done,
            }
            
            if majorStages is not None:
                major_stages_list = fetch_major_stages(journey.id)
                if not isinstance(major_stages_list, Exception):
                  journey_data['majorStages'] = major_stages_list
                else:
                  return major_stages_list
            
            journeys_list.append(journey_data)
        
        return journeys_list
    except Exception as e:
        return e


def fetch_major_stages(journeyId):
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
            
            minorStages = db.session.execute(db.select(MinorStage).filter_by(major_stage_id=majorStage.id)).scalars().all()
                        
            # Append the whole major stage, that matches the model from frontend to the list
            major_stage_data = {
                'id': majorStage.id,
                'title': majorStage.title,
                'country': majorStage.country,
                'done': majorStage.done,
                'scheduled_start_time': formatDateToString(majorStage.scheduled_start_time),
                'scheduled_end_time': formatDateToString(majorStage.scheduled_end_time),
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
                    'start_time': formatDateTimeToString(transportation.start_time),
                    'arrival_time': formatDateTimeToString(transportation.arrival_time),
                    'place_of_departure': transportation.place_of_departure,
                    'departure_latitude': transportation.departure_latitude if transportation.departure_latitude else None,
                    'departure_longitude': transportation.departure_longitude if transportation.departure_longitude else None,
                    'place_of_arrival': transportation.place_of_arrival,
                    'arrival_latitude': transportation.arrival_latitude if transportation.arrival_latitude else None,
                    'arrival_longitude': transportation.arrival_longitude if transportation.arrival_longitude else None,
                    'transportation_costs': transportation.transportation_costs,
                    'link': transportation.link,
                }
            
            if minorStages is not None:
                minor_stages_list = fetch_minor_stages(majorStage.id)
                if not isinstance(minor_stages_list, Exception):
                  major_stage_data['minorStages'] = minor_stages_list
                else:
                  return minor_stages_list
                            
            major_stages_list.append(major_stage_data)
        
        return major_stages_list
    except Exception as e:
        return e
      
def fetch_minor_stages(majorStageId):
    try:
        # Get all the minor stages from the database
        result = db.session.execute(db.select(MinorStage).filter_by(major_stage_id=majorStageId).order_by(MinorStage.scheduled_start_time))
        minorStages = result.scalars().all()
                
        # Fetch costs, transportation, accommodation, activities and places_to_visit for each minor_stage
        minor_stages_list = []
        for minorStage in minorStages:
            costs_result = db.session.execute(db.select(Costs).filter_by(minor_stage_id=minorStage.id))
            costs = costs_result.scalars().first()
            spendings = db.session.execute(db.select(Spendings).filter_by(costs_id=costs.id).order_by(Spendings.date)).scalars().all()
            
            transportation = db.session.execute(db.select(Transportation).filter_by(minor_stage_id=minorStage.id)).scalars().first()
            accommodation = db.session.execute(db.select(Accommodation).filter_by(minor_stage_id=minorStage.id)).scalars().first()          
            activities = db.session.execute(db.select(Activity).filter_by(minor_stage_id=minorStage.id)).scalars().all()
            places_to_visit = db.session.execute(db.select(PlaceToVisit).filter_by(minor_stage_id=minorStage.id)).scalars().all()
                                           
            # Append the whole minor stage, that matches the model from frontend to the list
            minor_stage_data = {
                'id': minorStage.id,
                'title': minorStage.title,
                'scheduled_start_time': formatDateToString(minorStage.scheduled_start_time),
                'scheduled_end_time': formatDateToString(minorStage.scheduled_end_time),
                'done': minorStage.done,
                'costs': {
                    'budget': costs.budget,
                    'spent_money': costs.spent_money,
                    'money_exceeded': costs.money_exceeded,
                },
                'accommodation': {
                                    'place': accommodation.place,
                                    'costs': accommodation.costs,
                                    'booked': accommodation.booked,
                                    'latitude': accommodation.latitude if accommodation.latitude else None,
                                    'longitude': accommodation.longitude if accommodation.longitude else None,
                                    'link': accommodation.link,
                                }
            }
            
            if transportation is not None:
                minor_stage_data['transportation'] = {
                    'id': transportation.id,
                    'type': transportation.type,
                    'start_time': formatDateTimeToString(transportation.start_time),
                    'arrival_time': formatDateTimeToString(transportation.arrival_time),
                    'place_of_departure': transportation.place_of_departure,
                    'departure_latitude': transportation.departure_latitude if transportation.departure_latitude else None,
                    'departure_longitude': transportation.departure_longitude if transportation.departure_longitude else None,
                    'place_of_arrival': transportation.place_of_arrival,
                    'arrival_latitude': transportation.arrival_latitude if transportation.arrival_latitude else None,
                    'arrival_longitude': transportation.arrival_longitude if transportation.arrival_longitude else None,
                    'transportation_costs': transportation.transportation_costs,
                    'link': transportation.link,
                }
                
            if spendings is not None:
                minor_stage_data['costs']['spendings'] = [{'id': spending.id, 'name': spending.name, 'amount': spending.amount, 'date': formatDateToString(spending.date), 'category': spending.category} for spending in spendings]
                        
            if activities is not None:
                minor_stage_data['activities'] = [{'id': activity.id, 'name': activity.name, 'description': activity.description, 'costs': activity.costs, 'booked': activity.booked, 'place': activity.place, 'latitude': activity.latitude, 'longitude': activity.longitude ,'link': activity.link} for activity in activities]
            
            if places_to_visit is not None:
                minor_stage_data['placesToVisit'] = [{'countryId': place_to_visit.custom_country_id ,'id': place_to_visit.id, 'name': place_to_visit.name, 'description': place_to_visit.description, 'visited': place_to_visit.visited, 'favorite': place_to_visit.favorite, 'latitude': place_to_visit.latitude, 'longitude': place_to_visit.longitude, 'link': place_to_visit.link} for place_to_visit in places_to_visit]
            
            minor_stages_list.append(minor_stage_data)
        
        return minor_stages_list
    except Exception as e:
        return e