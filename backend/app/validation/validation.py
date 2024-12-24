from datetime import datetime
import re

class Validation:
  def __init__(self):
    self.error_list = []
    self.current_date_string = datetime.now().strftime('%Y-%m-%d')
    
  def __return_feedback(self):    
    if len(self.error_list) == 0:
      return False
    elif len(self.error_list) == 1:
      return self.error_list[0]
    elif len(self.error_list) > 1:
      return ', '.join(self.error_list)
      # print(self.error_list)
      # return self.error_list
  
  
  def validate_string(self, value: str, min_length: int = 1, max_length: int = 250) -> bool | None:    
    if not value and min_length == 0:
      pass    
    elif len(value.strip()) < min_length:
      self.error_list.append(f'Min length is {min_length}')
    
    try:
      if len(value.strip()) > max_length:
        self.error_list.append(f'Max length is {max_length}')
    except AttributeError:
      pass
      
    return self.__return_feedback()
    
    
    # TODO: Adjust to DD.MM.YYYY
  def validate_date(self, value: str, min_date: str = None) -> bool | None:
    try:
      datetime.strptime(value, '%Y-%m-%d')
    except (TypeError , ValueError):
      self.error_list.append('Required format: YYYY-MM-DD')
    else:
      if not min_date:
        min_date = self.current_date_string
        
      if datetime.strptime(value, '%Y-%m-%d') < datetime.strptime(min_date, '%Y-%m-%d'):
        self.error_list.append('Date cannot be earlier than the current date')
    finally:
      return self.__return_feedback()
        
      
       # TODO: Adjust to DD.MM.YYYY  
  def compare_dates(self, start_date: str, end_date: str) -> bool | str:
    try:
      datetime.strptime(start_date, '%Y-%m-%d')
      datetime.strptime(end_date, '%Y-%m-%d')
    except (TypeError , ValueError):
      return self.__return_feedback()
    else:
      if datetime.strptime(start_date, '%Y-%m-%d') > datetime.strptime(end_date, '%Y-%m-%d'):
        self.error_list.append('Start date cannot be later than end date')
      
      return self.__return_feedback()
    
    
  def validate_amount(self, amount: int):
    amount = int(amount)
    if amount < 0:
      self.error_list.append('Amount cannot be negative')
    
    return self.__return_feedback()
  
  
  def validate_email(self, email:str):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    if(not re.fullmatch(regex, email)):
        self.error_list.append("Invalid Email")
    
    return self.__return_feedback()
  
  def validate_password(self, password:str, min_length:int = 6, max_length:int = 20):
    print(password)
    if len(password) < min_length:
      self.error_list.append(f'Min length is {min_length}')
      
    if len(password) > max_length:
      self.error_list.append(f'Max length is {max_length}')
      
    if(not re.match(r'(.*?[A-Z])', password)):
      self.error_list.append("Must contain one uppercase letter")
      
    if(not re.match(r'(.*?[a-z])', password)):
      self.error_list.append("Must contain one lowercase letter")
      
    if(not re.match(r'(.*?[0-9])', password)):
      self.error_list.append("Must contain one digit")
      
    if(not re.match(r"(.*?[!\?\(\)\[\]@#$%^&*])", password)):
      self.error_list.append("Must contain one special character")
    
    return self.__return_feedback()