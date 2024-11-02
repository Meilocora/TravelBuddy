from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Boolean, ForeignKey, Float

from db import db


class Journey(db.Model):
    __tablename__ = 'journeys'
    __table_args__ = {'extend_existing': True}
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    scheduled_start_time: Mapped[str] = mapped_column(String(10), nullable=False)
    scheduled_end_time: Mapped[str] = mapped_column(String(10), nullable=False)
    countries: Mapped[str] = mapped_column(String, nullable=False)
    done: Mapped[bool] = mapped_column(Boolean, nullable=False)
    
    # Define relationships to children
    major_stages: Mapped[list['MajorStage']] = relationship('MajorStage', back_populates='journey', cascade='all, delete-orphan')    
    costs: Mapped['Costs'] = relationship('Costs', back_populates='journey', uselist=False, cascade='all, delete-orphan')

class MajorStage(db.Model):
    __tablename__ = 'major_stages'
    __table_args__ = {'extend_existing': True}
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(40), nullable=False)
    scheduled_start_time: Mapped[str] = mapped_column(String(10), nullable=False)
    scheduled_end_time: Mapped[str] = mapped_column(String(10), nullable=False)
    country: Mapped[str] = mapped_column(String(40), nullable=False)
    done: Mapped[bool] = mapped_column(Boolean, nullable=False)
    
    # Define relationships to children
    costs: Mapped['Costs'] = relationship('Costs', back_populates='major_stage', uselist=False, cascade='all, delete-orphan')
    transportation: Mapped['Transportation'] = relationship('Transportation', back_populates='major_stage', uselist=False, cascade='all, delete-orphan')
    minor_stages: Mapped[list['MinorStage']] = relationship('MinorStage', back_populates='major_stage', cascade='all, delete-orphan')
    
    # Foreign keys to the parent
    journey_id: Mapped[int] = mapped_column(Integer, ForeignKey('journeys.id'), nullable=False)
    
    # Define the relationship to the parent
    journey: Mapped['Journey'] = relationship('Journey', back_populates='major_stages')
    
    
class MinorStage(db.Model):
    __tablename__ = 'minor_stages'
    __table_args__ = {'extend_existing': True}
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(40), nullable=False)
    scheduled_start_time: Mapped[str] = mapped_column(String(10), nullable=False)
    scheduled_end_time: Mapped[str] = mapped_column(String(10), nullable=False)
    done: Mapped[bool] = mapped_column(Boolean, nullable=False)
    
    # Define relationships to children
    costs: Mapped['Costs'] = relationship('Costs', back_populates='minor_stage', uselist=False, cascade='all, delete-orphan')
    transportation: Mapped['Transportation'] = relationship('Transportation', back_populates='minor_stage', uselist=False, cascade='all, delete-orphan')
    accommodation: Mapped['Accommodation'] = relationship('Accommodation', back_populates='minor_stage', uselist=False, cascade='all, delete-orphan')
    activities: Mapped[list['Activity']] = relationship('Activity', back_populates='minor_stage', cascade='all, delete-orphan')
    places_to_visit: Mapped[list['PlaceToVisit']] = relationship('PlaceToVisit', back_populates='minor_stage', cascade='all, delete-orphan')
    
    # Foreign keys to the parent
    major_stage_id: Mapped[int] = mapped_column(Integer, ForeignKey('major_stages.id'), nullable=False)
    
    # Define the relationship to the parent
    major_stage: Mapped['MajorStage'] = relationship('MajorStage', back_populates='minor_stages')
    
class Costs(db.Model):
    __tablename__ = 'costs'
    __table_args__ = {'extend_existing': True}
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    available_money: Mapped[int] = mapped_column(Integer, nullable=False)
    planned_costs: Mapped[int] = mapped_column(Integer, nullable=False)
    money_exceeded: Mapped[bool] = mapped_column(Boolean, nullable=False)
    
    # Foreign keys to the parents
    journey_id: Mapped[int] = mapped_column(Integer, ForeignKey('journeys.id'), nullable=True)
    major_stage_id: Mapped[int] = mapped_column(Integer, ForeignKey('major_stages.id'), nullable=True)
    minor_stage_id: Mapped[int] = mapped_column(Integer, ForeignKey('minor_stages.id'), nullable=True)
                                          
    # Define the relationships to the parents
    journey: Mapped['Journey'] = relationship('Journey', back_populates='costs')
    major_stage: Mapped['MajorStage'] = relationship('MajorStage', back_populates='costs')
    minor_stage: Mapped['MinorStage'] = relationship('MinorStage', back_populates='costs')
    
    
class Transportation(db.Model):
    __tablename__ = 'transportations'
    __table_args__ = {'extend_existing': True}
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    type: Mapped[str] = mapped_column(String, nullable=False)
    start_time: Mapped[str] = mapped_column(String, nullable=False)
    arrival_time: Mapped[str] = mapped_column(String, nullable=False)  
    place_of_departure: Mapped[str] = mapped_column(String, nullable=False) 
    place_of_arrival: Mapped[str] = mapped_column(String, nullable=False)   
    transportation_costs: Mapped[int] = mapped_column(Integer, nullable=False)  
    link: Mapped[str] = mapped_column(String, nullable=True) 
    
     # Foreign keys to the parents
    major_stage_id: Mapped[int] = mapped_column(Integer, ForeignKey('major_stages.id'), nullable=True)
    minor_stage_id: Mapped[int] = mapped_column(Integer, ForeignKey('minor_stages.id'), nullable=True)
     
     # Define the relationships to the parents
    major_stage: Mapped['MajorStage'] = relationship('MajorStage', back_populates='transportation')
    minor_stage: Mapped['MinorStage'] = relationship('MinorStage', back_populates='transportation')
    

class Accommodation(db.Model):
    __tablename__ = 'accommodations'
    __table_args__ = {'extend_existing': True}
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)
    
    place: Mapped[str] = mapped_column(String, nullable=False) 
    costs: Mapped[int] = mapped_column(Integer, nullable=False)  
    booked: Mapped[bool] = mapped_column(Boolean, nullable=False)
    link: Mapped[str] = mapped_column(String, nullable=True) 
    
    # Foreign keys to the parents
    minor_stage_id: Mapped[int] = mapped_column(Integer, ForeignKey('minor_stages.id'), nullable=True)
     
    # Define the relationships to the parents
    minor_stage: Mapped['MinorStage'] = relationship('MinorStage', back_populates='accommodation')
    

class Activity(db.Model):
    __tablename__ = 'activities'
    __table_args__ = {'extend_existing': True}
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    
    costs: Mapped[int] = mapped_column(Integer, nullable=False)  
    booked: Mapped[bool] = mapped_column(Boolean, nullable=False)
    place: Mapped[str] = mapped_column(String, nullable=False) 
    link: Mapped[str] = mapped_column(String, nullable=True) 
    
    # Foreign keys to the parents
    minor_stage_id: Mapped[int] = mapped_column(Integer, ForeignKey('minor_stages.id'), nullable=True)
     
    # Define the relationships to the parents
    minor_stage: Mapped['MinorStage'] = relationship('MinorStage', back_populates='activities')
    
    
class PlaceToVisit(db.Model):
    __tablename__ = 'places_to_visit'
    __table_args__ = {'extend_existing': True}
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)
    
    visited: Mapped[bool] = mapped_column(Boolean, nullable=False)
    favorite: Mapped[bool] = mapped_column(Boolean, nullable=False)
    link: Mapped[str] = mapped_column(String, nullable=True) 
    
    # Foreign keys to the parents
    minor_stage_id: Mapped[int] = mapped_column(Integer, ForeignKey('minor_stages.id'), nullable=True)
     
    # Define the relationships to the parents
    minor_stage: Mapped['MinorStage'] = relationship('MinorStage', back_populates='places_to_visit')