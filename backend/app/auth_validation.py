from datetime import datetime
from app.validation import Validation

class AuthValidation(Validation):
  def __init__(self):
    super().__init__()
    
  
#   @staticmethod
#   def validate_login(loginData):
#         errors = False
      
#         for key, value in loginData.items():
#             if value['value'] == "" or value['value'] == None:
#                 loginData[key]['errors'].append(f'Input is required')
#                 loginData[key]['isValid'] = False
        
#         if len(loginData['']['value']) == 0:
#             journey['countries']['errors'].append(f'At least one country is required')
#             journey['countries']['isValid'] = False
            
                 
        
            
            
#         for key, value in journey.items():
#             if 'errors' in value and value['errors']:
#                 errors = True
#                 break
        
     
#         return journey, not errors
     
  @staticmethod
  def validate_signUp(signUpData):
        errors = False
    
        for key, value in signUpData.items():
            if value['value'] == "" or value['value'] == None:
                signUpData[key]['errors'].append(f'Input is required')
                signUpData[key]['isValid'] = False
        
        userNameInvalid = AuthValidation().validate_string(signUpData['username']['value'], min_length=3, max_length=20)
        if userNameInvalid:
            signUpData['username']['errors'].append(f", {userNameInvalid}")
            signUpData['username']['isValid'] = False
                
        # emailInvalid = AuthValidation().validate_email(signUpData['email']['value'])
        # if emailInvalid:
            # signUpData['email']['errors'].append(f", {emailInvalid}")
            # signUpData['email']['isValid'] = False
            
        passwordInvalid = AuthValidation().validate_password(signUpData['password']['value'], min_length=6, max_length=20)
        if passwordInvalid:
            print(passwordInvalid.split(', '))
            signUpData['password']['errors'] += passwordInvalid.split(', ')
            signUpData['password']['isValid'] = False
                
        for key, value in signUpData.items():
            if 'errors' in value and value['errors']:
                errors = True
                break
        
        return signUpData, not errors
     
        
     
