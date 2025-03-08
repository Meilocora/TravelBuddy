import locale
from app.validation.validation import Validation

locale.setlocale(locale.LC_ALL, 'de_DE.UTF-8')

class TransportationValidation(Validation):
  def __init__(self):
    super().__init__()
    
  
  @staticmethod
  def validate_transportation(transportation):
        errors = False
      
        for key, value in transportation.items():
            if key != 'transportation_costs' and key != 'link':
                if value['value'] == "" or value['value'] == None:
                    transportation[key]['errors'].append(f'Input is required')
                    transportation[key]['isValid'] = False
            
                 
        type_val = TransportationValidation().validate_transportation_type(transportation['type']['value'])
        if type_val:
            transportation['type']['errors'].append(f", {type_val}")
            transportation['type']['isValid'] = False
           
        place_departurte_val = TransportationValidation().validate_string(transportation['place_of_departure']['value'], min_length=0, max_length=50)
        if place_departurte_val:
            transportation['place_of_departure']['errors'].append(f", {place_departurte_val}")
            transportation['place_of_departure']['isValid'] = False
        
        place_arrival_val = TransportationValidation().validate_string(transportation['place_of_arrival']['value'], min_length=0, max_length=50)
        if place_arrival_val:
            transportation['place_of_arrival']['errors'].append(f", {place_arrival_val}")
            transportation['place_of_arrival']['isValid'] = False
          
        start_val = TransportationValidation().validate_date_time(transportation['start_time']['value'])
        if start_val:
            transportation['start_time']['errors'].append(f", {start_val}")
            transportation['start_time']['isValid'] = False
            
        arrival_val = TransportationValidation().validate_date_time(transportation['arrival_time']['value'])
        if arrival_val:
            transportation['arrival_time']['errors'].append(f", {arrival_val}")
            transportation['arrival_time']['isValid'] = False
        
        start_end_val = TransportationValidation().compare_date_times(transportation['start_time']['value'], transportation['arrival_time']['value'])
        if start_end_val:
            transportation['start_time']['errors'].append(f", {start_end_val}")
            transportation['start_time']['isValid'] = False
                
        money_val = TransportationValidation().validate_amount(transportation['transportation_costs']['value'])
        if money_val:
            transportation['transportation_costs']['errors'].append(f", {money_val}")
            transportation['transportation_costs']['isValid'] = False
        
        if transportation['link']['value'] != "":
            link_val = TransportationValidation().validate_hyperlink(transportation['link']['value'])
            if link_val:
                transportation['link']['errors'].append(f", {link_val}")
                transportation['link']['isValid'] = False
            
            
        for key, value in transportation.items():
            if 'errors' in value and value['errors']:
                errors = True
                break
        
     
        return transportation, not errors
     
#   @staticmethod
#   def validate_major_stage_update(majorStage, old_major_stage, existing_major_stages, existing_major_stages_costs,journey_costs):
#         errors = False
      
#         for key, value in majorStage.items():
#             if key != 'additional_info':
#                 if value['value'] == "" or value['value'] == None:
#                     majorStage[key]['errors'].append(f'Input is required')
#                     majorStage[key]['isValid'] = False
            
                 
#         title_val = MajorStageValidation().validate_string(majorStage['title']['value'], min_length=3, max_length=50)
#         if title_val:
#             majorStage['title']['errors'].append(f", {title_val}")
#             majorStage['title']['isValid'] = False
           
#         info_val = MajorStageValidation().validate_string(majorStage['additional_info']['value'], min_length=0, max_length=1000)
#         if info_val:
#             majorStage['additional_info']['errors'].append(f", {title_val}")
#             majorStage['additional_info']['isValid'] = False
        
#         for existing_major_stage in existing_major_stages:
#             start_val = MajorStageValidation().check_for_overlap(majorStage['scheduled_start_time']['value'], existing_major_stage.scheduled_start_time, existing_major_stage.scheduled_end_time, existing_major_stage.title, mode='start')
#             if start_val:   
#                 majorStage['scheduled_start_time']['errors'].append(f", {start_val}")             
#                 majorStage['scheduled_start_time']['isValid'] = False
                
#             end_val = MajorStageValidation().check_for_overlap(majorStage['scheduled_end_time']['value'], existing_major_stage.scheduled_start_time, existing_major_stage.scheduled_end_time, existing_major_stage.title, mode='end')
#             if end_val:
#                 majorStage['scheduled_end_time']['errors'].append(f", {end_val}")
#                 majorStage['scheduled_end_time']['isValid'] = False
            
#         start_val = MajorStageValidation().validate_date(majorStage['scheduled_start_time']['value'])
#         if start_val:
#             majorStage['scheduled_start_time']['errors'].append(f", {start_val}")
#             majorStage['scheduled_start_time']['isValid'] = False
        
#         end_val = MajorStageValidation().validate_date(majorStage['scheduled_end_time']['value'])
#         if end_val:
#             majorStage['scheduled_end_time']['errors'].append(f", {end_val}")
#             majorStage['scheduled_end_time']['isValid'] = False
            
#         start_end_val = MajorStageValidation().compare_dates(majorStage['scheduled_start_time']['value'], majorStage['scheduled_end_time']['value'])
#         if start_end_val:
#             majorStage['scheduled_start_time']['errors'].append(f", {start_end_val}")
#             majorStage['scheduled_start_time']['isValid'] = False
            
#         money_val = MajorStageValidation().validate_amount(majorStage['budget']['value'])
#         if money_val:
#             majorStage['budget']['errors'].append(f", {money_val}")
#             majorStage['budget']['isValid'] = False
            
#         available_major_stages_money = int(majorStage['budget']['value'])
#         available_journey_money = journey_costs.budget
#         for existing_major_stage_cost in existing_major_stages_costs:
#             available_major_stages_money += existing_major_stage_cost.budget
#         if available_major_stages_money > available_journey_money:
#             max_available_money = available_journey_money - available_major_stages_money + int(majorStage['budget']['value'])
#             max_available_money_str = locale.currency(max_available_money, grouping=True)
#             majorStage['budget']['errors'].append(f", Max available amount for journey: {max_available_money_str}")
#             majorStage['budget']['isValid'] = False
            
#         for key, value in majorStage.items():
#             if 'errors' in value and value['errors']:
#                 errors = True
#                 break
        
     
#         return majorStage, not errors