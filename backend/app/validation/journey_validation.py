from datetime import datetime
from db import db
from app.validation.validation import Validation

class JourneyValidation(Validation):
  def __init__(self):
    super().__init__()
    
  
  @staticmethod
  def validate_journey(journey, existing_journeys):
        errors = False
      
        for key, value in journey.items():
            if value['value'] == "" or value['value'] == None:
                journey[key]['errors'].append(f'Input is required')
                journey[key]['isValid'] = False
            
                 
        if JourneyValidation().validate_string(journey['name']['value'], min_length=3, max_length=50):
            journey['name']['errors'].append(f", {JourneyValidation().validate_string(journey['name']['value'], 3, 50)}")
            journey['name']['isValid'] = False
            
        
        for existing_journey in existing_journeys:
            start_val = JourneyValidation().check_for_overlap(journey['scheduled_start_time']['value'], existing_journey.scheduled_start_time, existing_journey.scheduled_end_time, existing_journey.name, mode='start')
            if start_val:   
                journey['scheduled_start_time']['errors'].append(f", {start_val}")             
                journey['scheduled_start_time']['isValid'] = False
                
            end_val = JourneyValidation().check_for_overlap(journey['scheduled_end_time']['value'], existing_journey.scheduled_start_time, existing_journey.scheduled_end_time, existing_journey.name, mode='end')
            if end_val:
                journey['scheduled_end_time']['errors'].append(f", {end_val}")
                journey['scheduled_end_time']['isValid'] = False
                
            
        if JourneyValidation().validate_date(journey['scheduled_start_time']['value']):
            journey['scheduled_start_time']['errors'].append(f", {JourneyValidation().validate_date(journey['scheduled_start_time']['value'])}")
            journey['scheduled_start_time']['isValid'] = False
        
        if JourneyValidation().validate_date(journey['scheduled_end_time']['value']):
            journey['scheduled_end_time']['errors'].append(f", {JourneyValidation().validate_date(journey['scheduled_end_time']['value'])}")
            journey['scheduled_end_time']['isValid'] = False
            
        if JourneyValidation().compare_dates(journey['scheduled_start_time']['value'], journey['scheduled_end_time']['value']):
            journey['scheduled_start_time']['errors'].append(f", {JourneyValidation().compare_dates(journey['scheduled_start_time']['value'], journey['scheduled_end_time']['value'])}")
            journey['scheduled_start_time']['isValid'] = False
            
        if JourneyValidation().validate_amount(journey['available_money']['value']):
            journey['available_money']['errors'].append(f", {JourneyValidation().validate_amount(journey['available_money']['value'])}")
            journey['available_money']['isValid'] = False
            
            
        for key, value in journey.items():
            if 'errors' in value and value['errors']:
                errors = True
                break
        
     
        return journey, not errors
     
  @staticmethod
  def validate_journey_update(journey):
          errors = False
        
          for key, value in journey.items():
              if value['value'] == "" or value['value'] == None:
                  journey[key]['errors'].append(f'Input is required')
                  journey[key]['isValid'] = False
            
          if len(journey['countries']['value']) == 0:
              journey['countries']['errors'].append(f'At least one country is required')
              journey['countries']['isValid'] = False    
                    
          if JourneyValidation().validate_string(journey['name']['value'], min_length=3):
              journey['name']['errors'].append(f", {JourneyValidation().validate_string(journey['name']['value'], 10)}")
              journey['name']['isValid'] = False
               
          if JourneyValidation().validate_date(journey['scheduled_start_time']['value']):
              journey['scheduled_start_time']['errors'].append(f", {JourneyValidation().validate_date(journey['scheduled_start_time']['value'])}")
              journey['scheduled_start_time']['isValid'] = False
            
          if JourneyValidation().validate_date(journey['scheduled_end_time']['value']):
              journey['scheduled_end_time']['errors'].append(f", {JourneyValidation().validate_date(journey['scheduled_end_time']['value'])}")
              journey['scheduled_end_time']['isValid'] = False
                
          if JourneyValidation().compare_dates(journey['scheduled_start_time']['value'], journey['scheduled_end_time']['value']):
              journey['scheduled_start_time']['errors'].append(f", {JourneyValidation().compare_dates(journey['scheduled_start_time']['value'], journey['scheduled_end_time']['value'])}")
              journey['scheduled_start_time']['isValid'] = False
                
          if JourneyValidation().validate_amount(journey['available_money']['value']):
              journey['available_money']['errors'].append(f", {JourneyValidation().validate_amount(journey['available_money']['value'])}")
              journey['available_money']['isValid'] = False
                
                
          for key, value in journey.items():
              if 'errors' in value and value['errors']:
                  errors = True
                  break
            
        
          return journey, not errors
     
        
     
