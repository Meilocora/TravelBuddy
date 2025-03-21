from datetime import datetime
import locale
from db import db
from app.validation.validation import Validation

locale.setlocale(locale.LC_ALL, 'de_DE.UTF-8')

class MinorStageValidation(Validation):
  def __init__(self):
    super().__init__()
    
  
  @staticmethod
  def validate_minor_stage(minorStage, existing_minor_stages):
        errors = False
      
        for key, value in minorStage.items():
                if value['value'] == "" or value['value'] == None:
                    minorStage[key]['errors'].append(f'Input is required')
                    minorStage[key]['isValid'] = False
            
                 
        title_val = MinorStageValidation().validate_string(minorStage['title']['value'], min_length=3, max_length=50)
        if title_val:
            minorStage['title']['errors'].append(f", {title_val}")
            minorStage['title']['isValid'] = False
        
        for existing_minor_stage in existing_minor_stages:
            start_val = MinorStageValidation().check_for_overlap(minorStage['scheduled_start_time']['value'], existing_minor_stage.scheduled_start_time, existing_minor_stage.scheduled_end_time, existing_minor_stage.title, mode='start')
            if start_val:   
                minorStage['scheduled_start_time']['errors'].append(f", {start_val}")             
                minorStage['scheduled_start_time']['isValid'] = False
                
            end_val = MinorStageValidation().check_for_overlap(minorStage['scheduled_end_time']['value'], existing_minor_stage.scheduled_start_time, existing_minor_stage.scheduled_end_time, existing_minor_stage.title, mode='end')
            if end_val:
                minorStage['scheduled_end_time']['errors'].append(f", {end_val}")
                minorStage['scheduled_end_time']['isValid'] = False
            
        start_val = MinorStageValidation().validate_date(minorStage['scheduled_start_time']['value'])
        if start_val:
            minorStage['scheduled_start_time']['errors'].append(f", {start_val}")
            minorStage['scheduled_start_time']['isValid'] = False
        
        end_val = MinorStageValidation().validate_date(minorStage['scheduled_end_time']['value'])
        if end_val:
            minorStage['scheduled_end_time']['errors'].append(f", {end_val}")
            minorStage['scheduled_end_time']['isValid'] = False
            
        start_end_val = MinorStageValidation().compare_dates(minorStage['scheduled_start_time']['value'], minorStage['scheduled_end_time']['value'])
        if start_end_val:
            minorStage['scheduled_start_time']['errors'].append(f", {start_end_val}")
            minorStage['scheduled_start_time']['isValid'] = False
            
        for key, value in minorStage.items():
            if 'errors' in value and value['errors']:
                errors = True
                break
        
     
        return minorStage, not errors