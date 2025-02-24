from datetime import datetime
import locale
from db import db
from app.validation.validation import Validation

locale.setlocale(locale.LC_ALL, 'de_DE.UTF-8')

class MajorStageValidation(Validation):
  def __init__(self):
    super().__init__()
    
  
  @staticmethod
  def validate_major_stage(majorStage, existing_major_stages, existing_major_stages_costs, journey_costs):
        errors = False
      
        for key, value in majorStage.items():
            if key != 'additional_info':
                if value['value'] == "" or value['value'] == None:
                    majorStage[key]['errors'].append(f'Input is required')
                    majorStage[key]['isValid'] = False
            
                 
        title_val = MajorStageValidation().validate_string(majorStage['title']['value'], min_length=3, max_length=50)
        if title_val:
            majorStage['title']['errors'].append(f", {title_val}")
            majorStage['title']['isValid'] = False
           
        info_val = MajorStageValidation().validate_string(majorStage['additional_info']['value'], min_length=0, max_length=1000)
        if info_val:
            majorStage['additional_info']['errors'].append(f", {title_val}")
            majorStage['additional_info']['isValid'] = False
        
        for existing_major_stage in existing_major_stages:
            start_val = MajorStageValidation().check_for_overlap(majorStage['scheduled_start_time']['value'], existing_major_stage.scheduled_start_time, existing_major_stage.scheduled_end_time, existing_major_stage.title, mode='start')
            if start_val:   
                majorStage['scheduled_start_time']['errors'].append(f", {start_val}")             
                majorStage['scheduled_start_time']['isValid'] = False
                
            end_val = MajorStageValidation().check_for_overlap(majorStage['scheduled_end_time']['value'], existing_major_stage.scheduled_start_time, existing_major_stage.scheduled_end_time, existing_major_stage.title, mode='end')
            if end_val:
                majorStage['scheduled_end_time']['errors'].append(f", {end_val}")
                majorStage['scheduled_end_time']['isValid'] = False
            
        start_val = MajorStageValidation().validate_date(majorStage['scheduled_start_time']['value'])
        if start_val:
            majorStage['scheduled_start_time']['errors'].append(f", {start_val}")
            majorStage['scheduled_start_time']['isValid'] = False
        
        end_val = MajorStageValidation().validate_date(majorStage['scheduled_end_time']['value'])
        if end_val:
            majorStage['scheduled_end_time']['errors'].append(f", {end_val}")
            majorStage['scheduled_end_time']['isValid'] = False
            
        start_end_val = MajorStageValidation().compare_dates(majorStage['scheduled_start_time']['value'], majorStage['scheduled_end_time']['value'])
        if start_end_val:
            majorStage['scheduled_start_time']['errors'].append(f", {start_end_val}")
            majorStage['scheduled_start_time']['isValid'] = False
            
        money_val = MajorStageValidation().validate_amount(majorStage['budget']['value'])
        if money_val:
            majorStage['budget']['errors'].append(f", {money_val}")
            majorStage['budget']['isValid'] = False
            
        available_major_stages_money = int(majorStage['budget']['value'])
        available_journey_money = journey_costs.budget
        for existing_major_stage_cost in existing_major_stages_costs:
            available_major_stages_money += existing_major_stage_cost.budget
        if available_major_stages_money > available_journey_money:
            max_available_money = available_major_stages_money - majorStage['budget']['value']
            max_available_money_str = locale.currency(max_available_money, grouping=True)
            majorStage['budget']['errors'].append(f", Max available amount for journey: {max_available_money_str}")
            majorStage['budget']['isValid'] = False
        
            
        for key, value in majorStage.items():
            if 'errors' in value and value['errors']:
                errors = True
                break
        
     
        return majorStage, not errors
     
  @staticmethod
  def validate_major_stage_update(majorStage, old_major_stage, existing_major_stages, existing_major_stages_costs,journey_costs):
        errors = False
      
        for key, value in majorStage.items():
            if key != 'additional_info':
                if value['value'] == "" or value['value'] == None:
                    majorStage[key]['errors'].append(f'Input is required')
                    majorStage[key]['isValid'] = False
            
                 
        title_val = MajorStageValidation().validate_string(majorStage['title']['value'], min_length=3, max_length=50)
        if title_val:
            majorStage['title']['errors'].append(f", {title_val}")
            majorStage['title']['isValid'] = False
           
        info_val = MajorStageValidation().validate_string(majorStage['additional_info']['value'], min_length=0, max_length=1000)
        if info_val:
            majorStage['additional_info']['errors'].append(f", {title_val}")
            majorStage['additional_info']['isValid'] = False
        
        for existing_major_stage in existing_major_stages:
            start_val = MajorStageValidation().check_for_overlap(majorStage['scheduled_start_time']['value'], existing_major_stage.scheduled_start_time, existing_major_stage.scheduled_end_time, existing_major_stage.title, mode='start')
            if start_val:   
                majorStage['scheduled_start_time']['errors'].append(f", {start_val}")             
                majorStage['scheduled_start_time']['isValid'] = False
                
            end_val = MajorStageValidation().check_for_overlap(majorStage['scheduled_end_time']['value'], existing_major_stage.scheduled_start_time, existing_major_stage.scheduled_end_time, existing_major_stage.title, mode='end')
            if end_val:
                majorStage['scheduled_end_time']['errors'].append(f", {end_val}")
                majorStage['scheduled_end_time']['isValid'] = False
            
        start_val = MajorStageValidation().validate_date(majorStage['scheduled_start_time']['value'])
        if start_val:
            majorStage['scheduled_start_time']['errors'].append(f", {start_val}")
            majorStage['scheduled_start_time']['isValid'] = False
        
        end_val = MajorStageValidation().validate_date(majorStage['scheduled_end_time']['value'])
        if end_val:
            majorStage['scheduled_end_time']['errors'].append(f", {end_val}")
            majorStage['scheduled_end_time']['isValid'] = False
            
        start_end_val = MajorStageValidation().compare_dates(majorStage['scheduled_start_time']['value'], majorStage['scheduled_end_time']['value'])
        if start_end_val:
            majorStage['scheduled_start_time']['errors'].append(f", {start_end_val}")
            majorStage['scheduled_start_time']['isValid'] = False
            
        money_val = MajorStageValidation().validate_amount(majorStage['budget']['value'])
        if money_val:
            majorStage['budget']['errors'].append(f", {money_val}")
            majorStage['budget']['isValid'] = False
            
        available_major_stages_money = int(majorStage['budget']['value'])
        available_journey_money = journey_costs.budget
        for existing_major_stage_cost in existing_major_stages_costs:
            available_major_stages_money += existing_major_stage_cost.budget
        if available_major_stages_money > available_journey_money:
            max_available_money = available_journey_money - available_major_stages_money + int(majorStage['budget']['value'])
            max_available_money_str = locale.currency(max_available_money, grouping=True)
            majorStage['budget']['errors'].append(f", Max available amount for journey: {max_available_money_str}")
            majorStage['budget']['isValid'] = False
            
        for key, value in majorStage.items():
            if 'errors' in value and value['errors']:
                errors = True
                break
        
     
        return majorStage, not errors