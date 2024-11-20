from flask import Blueprint, request, jsonify
from db import db
from app.models import User
from app.auth_validation import AuthValidation


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login-user', methods=['POST'])
def login():
  print('Login')
  try:
      # Login logic here
      return jsonify({'status': 'Login successful'})
  except Exception as e:
      return jsonify({'error': str(e)}, 500)

@auth_bp.route('/create-user', methods=['POST'])
def register():
  print('SignUp')
  try:
      signUpData = request.get_json()
  except:
      return jsonify({'error': 'Unknown error'}, 400)
    
  response, isValid = AuthValidation.validate_signUp(signUpData=signUpData)
  
  if not isValid:
    return jsonify({'authFormValues': response, 'status': 400})

    # TODO: Check if email or username already exists
    # TODO: Add user to database and return token + status
  

      
 