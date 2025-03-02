from app.validation.validation import Validation

class PlaceValidation(Validation):
  def __init__(self):
    super().__init__()
    
  
  @staticmethod
  def validate_place(place):
        errors = False
      
        for key, value in place.items():
            if key != 'link' and key != 'maps_link':
                
                if value['value'] == "" or value['value'] == None:
                    place[key]['errors'].append(f'Input is required')
                    place[key]['isValid'] = False
        
        
        if PlaceValidation().validate_string(place['name']['value'], min_length=3, max_length=25):
            place['name']['errors'].append(f", {PlaceValidation().validate_string(place['name']['value'], 3, 50)}")
            place['name']['isValid'] = False
            
        if PlaceValidation().validate_string(place['description']['value'], min_length=0, max_length=100):
            place['description']['errors'].append(f", {PlaceValidation().validate_string(place['description']['value'], 0, 300)}")
            place['description']['isValid'] = False
            
        if PlaceValidation().validate_string(place['link']['value'], min_length=0, max_length=200):
            place['link']['errors'].append(f", {PlaceValidation().validate_string(place['link']['value'], 0, 200)}")
            place['link']['isValid'] = False
            
        if PlaceValidation().validate_string(place['maps_link']['value'], min_length=0, max_length=200):
            place['maps_link']['errors'].append(f", {PlaceValidation().validate_string(place['maps_link']['value'], 0, 200)}")
            place['maps_link']['isValid'] = False
            
            
        for key, value in place.items():
            if 'errors' in value and value['errors']:
                errors = True
                break
        
     
        return place, not errors
