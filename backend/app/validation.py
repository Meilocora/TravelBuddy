from datetime import datetime

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
  
  
  def validate_string(self, value: str, min_length: int = 1, max_length: int = 250, mustContain: list = None) -> bool | None:    
    if len(value.strip()) < min_length:
      self.error_list.append(f'The input must have a length of at least {min_length}')
      
    if len(value.strip()) > max_length:
      self.error_list.append(f'The input must have a length of at most {max_length}')
    
    if mustContain:
      for item in mustContain:
        if item not in value:
          self.error_list.append(f'The string must contain {item}')
    
    return self.__return_feedback()
    
    
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