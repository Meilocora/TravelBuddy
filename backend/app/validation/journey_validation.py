from datetime import datetime
from app.validation.validation import Validation

class JourneyValidation(Validation):
  def __init__(self):
    super().__init__()
    
  
  @staticmethod
  def validate_journey(journey):
        errors = False
      
        for key, value in journey.items():
            if value['value'] == "" or value['value'] == None:
                journey[key]['errors'].append(f'Input is required')
                journey[key]['isValid'] = False
        
        if len(journey['countries']['value']) == 0:
            journey['countries']['errors'].append(f'At least one country is required')
            journey['countries']['isValid'] = False
            
                 
        if JourneyValidation().validate_string(journey['name']['value'], min_length=3):
            journey['name']['errors'].append(f", {JourneyValidation().validate_string(journey['name']['value'], 3)}")
            journey['name']['isValid'] = False
            
        # TODO: Check if overlaps with another journey
            
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
            
            # TODO: Check if a country is deleted, where a major stage is planned
          if len(journey['countries']['value']) == 0:
              journey['countries']['errors'].append(f'At least one country is required')
              journey['countries']['isValid'] = False
        
                
                    
          if JourneyValidation().validate_string(journey['name']['value'], min_length=3):
              journey['name']['errors'].append(f", {JourneyValidation().validate_string(journey['name']['value'], 10)}")
              journey['name']['isValid'] = False
               
               # TODO: Check if new start date is after start date of first major stage 
          if JourneyValidation().validate_date(journey['scheduled_start_time']['value']):
              journey['scheduled_start_time']['errors'].append(f", {JourneyValidation().validate_date(journey['scheduled_start_time']['value'])}")
              journey['scheduled_start_time']['isValid'] = False
            
            # TODO: Check if new end date is before end date of last major stage
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
     
        
     
