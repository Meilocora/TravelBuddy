import jwt
import datetime
from flask import Blueprint, request, jsonify
from db import db
from app.models import User
from app.validation.auth_validation import AuthValidation
import bcrypt
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the secret key from environment variables
SECRET_KEY = os.getenv('SECRET_KEY')
TOKEN_DURATION = 1  # duration in hours
REFRESHTOKEN_DURATION = 7  # duration in days

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login-user', methods=['POST'])
def login():
    try:
        loginData = request.get_json()
        user = User.query.filter_by(email=loginData['email']['value']).first()
        
        if user and bcrypt.checkpw(loginData['password']['value'].encode('utf-8'), user.password.encode('utf-8')):
            token = jwt.encode({
                'user_id': user.id,
                'username': user.username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_DURATION)
            }, SECRET_KEY, algorithm='HS256')
            
            refresh_token = jwt.encode({
                'user_id': user.id,
                'username': user.username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=REFRESHTOKEN_DURATION)
            }, SECRET_KEY, algorithm='HS256')
            return jsonify({'status': 200, 'token': token, 'refreshToken': refresh_token})
        else:
            return jsonify({'error': 'Invalid credentials','status': 401})
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500})


@auth_bp.route('/create-user', methods=['POST'])
def register():
    try:
        signUpData = request.get_json()
    except:
        return jsonify({'error': 'Unknown error'}, 400)
        
    response, isValid = AuthValidation.validate_signUp(signUpData=signUpData)
    
    if not isValid:
        return jsonify({'authFormValues': response, 'status': 400})

    # Check if email or username already exists
    existing_user = User.query.filter(
        (User.email == signUpData['email']['value']) | 
        (User.username == signUpData['username']['value'])
    ).first()

    if existing_user:
        if existing_user.email == signUpData['email']['value']:
            response['email']['errors'].append('Email already exists')
        if existing_user.username == signUpData['username']['value']:
            response['username']['errors'].append('Username already exists')
        return jsonify({'authFormValues': response, 'status': 400})
    
    # Hash the password
    hashed_password = bcrypt.hashpw(signUpData['password']['value'].encode('utf-8'), bcrypt.gensalt())

    # Add user to database
    try:
        new_user = User(
            username=signUpData['username']['value'],
            email=signUpData['email']['value'],
            password=hashed_password.decode('utf-8')
        )
        db.session.add(new_user)
        db.session.commit()
        
        # Create a token and a refreshtoken with expiration date
        token = jwt.encode({
            'user_id': new_user.id,
            'username': new_user.username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_DURATION)
        }, SECRET_KEY, algorithm='HS256')
        
        refresh_token = jwt.encode({
            'user_id': new_user.id,
            'username': new_user.username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=REFRESHTOKEN_DURATION)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({'status': 201, 'token': token, 'refreshToken': refresh_token})
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500})
  

@auth_bp.route('/refresh-token', methods=['POST'])
def refresh_token():
    try:
        refresh_token = request.json.get('refreshToken')
        decoded_refresh_token = jwt.decode(refresh_token, SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_refresh_token['user_id']
        username = decoded_refresh_token['username']
        
        # Generate new tokens
        new_token = jwt.encode({
            'user_id': user_id,
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_DURATION)
        }, SECRET_KEY, algorithm='HS256')
        
        new_refresh_token = jwt.encode({
            'user_id': user_id,
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=REFRESHTOKEN_DURATION)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({'newToken': new_token, 'newRefreshToken': new_refresh_token})
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500})
 