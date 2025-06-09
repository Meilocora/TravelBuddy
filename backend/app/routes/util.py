from datetime import datetime
from timezonefinder import TimezoneFinder
import pytz
from db import db
from app.models import Costs, Spendings, Transportation, MajorStage, MinorStage, Accommodation, Activity

def parseDate(dateString: str): 
    return datetime.strptime(dateString, '%d.%m.%Y')


def parseDateTime(dateTimeString: str):
    return datetime.strptime(dateTimeString, '%d.%m.%Y %H:%M')


def formatDateToString(date: datetime):
    return datetime.strftime(date, '%d.%m.%Y')


def formatDateTimeToString(dateTime: datetime):
    return datetime.strftime(dateTime, '%d.%m.%Y %H:%M')


def calculate_minor_stage_costs(minor_stage_costs):
    spent_money = 0
    
    transportation = db.session.execute(db.select(Transportation).filter_by(minor_stage_id=minor_stage_costs.minor_stage_id)).scalars().first()
    if transportation:
        spent_money += transportation.transportation_costs
    
    accommodation = db.session.execute(db.select(Accommodation).filter_by(minor_stage_id=minor_stage_costs.minor_stage_id)).scalars().first()
    spent_money += accommodation.costs
    
    activities = db.session.execute(db.select(Activity).filter_by(minor_stage_id=minor_stage_costs.minor_stage_id)).scalars().all()
    for activity in activities:
        spent_money += activity.costs
    
    spendings = db.session.execute(db.select(Spendings).filter_by(costs_id=minor_stage_costs.id)).scalars().all()
    for spending in spendings:
        spent_money += spending.amount
  
    minor_stage_costs.spent_money = spent_money
    minor_stage_costs.money_exceeded = minor_stage_costs.spent_money > minor_stage_costs.budget
    db.session.commit()
    return minor_stage_costs

def calculate_major_stage_costs(major_stage_costs):
    spent_money = 0
    
    transportation = db.session.execute(db.select(Transportation).filter_by(major_stage_id=major_stage_costs.major_stage_id)).scalars().first()
    if transportation:
        spent_money += transportation.transportation_costs
    
    spendings = db.session.execute(db.select(Spendings).filter_by(costs_id=major_stage_costs.id)).scalars().all()
    for spending in spendings:      
        spent_money += spending.amount
       
    minor_stages = db.session.execute(db.select(MinorStage).filter_by(major_stage_id=major_stage_costs.major_stage_id)).scalars().all()
    for minor_stage in minor_stages:
        minor_stage_costs = db.session.execute(db.select(Costs).filter_by(minor_stage_id=minor_stage.id)).scalars().first()
        updated_minor_stage_costs = calculate_minor_stage_costs(minor_stage_costs)
        spent_money += updated_minor_stage_costs.spent_money
  
    major_stage_costs.spent_money = spent_money
    major_stage_costs.money_exceeded = major_stage_costs.spent_money > major_stage_costs.budget
    db.session.commit()
    return major_stage_costs
    

def calculate_journey_costs(journey_costs):
    spent_money = 0
    
    major_stages = db.session.execute(db.select(MajorStage).filter_by(journey_id=journey_costs.journey_id)).scalars().all()
    for major_stage in major_stages:
        major_stage_costs = db.session.execute(db.select(Costs).filter_by(major_stage_id=major_stage.id)).scalars().first()
        updated_major_stage_cost = calculate_major_stage_costs(major_stage_costs)        
        spent_money += updated_major_stage_cost.spent_money
  
    journey_costs.spent_money = spent_money
    journey_costs.money_exceeded = journey_costs.spent_money > journey_costs.budget
    return db.session.commit()

tf = TimezoneFinder()

def calculate_time_zone_offset(lat, lng):
    target_timezone_str = tf.timezone_at(lng=lng, lat=lat)
    if not target_timezone_str:
        raise ValueError("Could not determine timezone for coordinates.")
    
    target_tz = pytz.timezone(target_timezone_str)
    now_utc = datetime.utcnow()
    # Get the offset of the target timezone from UTC at the current time
    target_offset = target_tz.utcoffset(now_utc)
    diff_hours = target_offset.total_seconds() / 3600
    
    return diff_hours
    
   
