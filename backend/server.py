import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

from db import db


# from app.journey_validation import JourneyValidation
from app.models import *
from app.routes.journey_routes  import journey_bp
from app.routes.major_stage_routes import major_stage_bp
from app.routes.minor_stage_routes import minor_stage_bp
from app.routes.auth_routes import auth_bp

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
CORS(app, resources={r'/*': {'origins': '*'}})

db.init_app(app)

# Register Blueprints
app.register_blueprint(journey_bp, url_prefix='/journey')
app.register_blueprint(major_stage_bp, url_prefix='/major-stage')
app.register_blueprint(minor_stage_bp, url_prefix='/minor-stage')
app.register_blueprint(auth_bp, url_prefix='/auth')


with app.app_context():
    db.create_all()     # Create the database if not exists
    

HOST = os.getenv('HOST')

if __name__ == '__main__':
    app.run(host=HOST, port=3000, debug=True)