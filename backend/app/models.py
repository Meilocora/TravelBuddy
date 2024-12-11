from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Boolean, ForeignKey, Float
from db import db

class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)

    # Define relationships to children
    journeys: Mapped[list['Journey']] = relationship('Journey', back_populates='user', cascade='all, delete-orphan')
    custom_countries: Mapped[list['CustomCountry']] = relationship('CustomCountry', back_populates='user', cascade='all, delete-orphan')
    places_to_visit: Mapped[list['PlaceToVisit']] = relationship('PlaceToVisit', back_populates='user', cascade='all, delete-orphan')

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
    
    # Foreign keys to the parent
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Define the relationship to the parent
    user: Mapped['User'] = relationship('User', back_populates='journeys')
    
    # Many-to-Many relationship with CustomCountry
    custom_countries: Mapped[list['CustomCountry']] = relationship(
        'CustomCountry',
        secondary='journeys_custom_countries',
        back_populates='journeys'
    )

class CustomCountry(db.Model):
    __tablename__ = 'custom_countries'
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    code: Mapped[str] = mapped_column(String(2), nullable=True)
    timezones: Mapped[str] = mapped_column(String(40), nullable=True)
    currencies: Mapped[str] = mapped_column(String(3), nullable=True)
    languages: Mapped[str] = mapped_column(String(40), nullable=True)
    capital: Mapped[str] = mapped_column(String(40), nullable=True)
    population: Mapped[int] = mapped_column(Integer, nullable=True)
    region: Mapped[str] = mapped_column(String(40), nullable=True)
    subregion: Mapped[str] = mapped_column(String(40), nullable=True)
    wiki_link: Mapped[str] = mapped_column(String, nullable=True)
    visited: Mapped[bool] = mapped_column(Boolean, nullable=True)
    visum_regulations: Mapped[str] = mapped_column(String, nullable=True)
    best_time_to_visit: Mapped[str] = mapped_column(String, nullable=True)
    general_information: Mapped[str] = mapped_column(String, nullable=True)
    
    # Define relationships to children
    places_to_visit: Mapped[list['PlaceToVisit']] = relationship('PlaceToVisit', back_populates='custom_country', cascade='all, delete-orphan')

    # Foreign keys to the parent
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    major_stage_id: Mapped[int] = mapped_column(Integer, ForeignKey('major_stages.id'), nullable=True)
    
    # Define the relationship to the parent
    user: Mapped['User'] = relationship('User', back_populates='custom_countries')
    major_stage: Mapped['MajorStage'] = relationship('MajorStage', back_populates='custom_country')
    
    # Many-to-Many relationship with Journey
    journeys: Mapped[list['Journey']] = relationship(
        'Journey',
        secondary='journeys_custom_countries',
        back_populates='custom_countries'
    )

# join table for many-to-many relationship between journeys and custom_countries
journeys_custom_countries = db.Table('journeys_custom_countries',
    db.Column('journey_id', db.Integer, db.ForeignKey('journeys.id'), primary_key=True),
    db.Column('custom_country_id', db.Integer, db.ForeignKey('custom_countries.id'), primary_key=True)
)

class MajorStage(db.Model):
    __tablename__ = 'major_stages'
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(40), nullable=False)
    done: Mapped[bool] = mapped_column(Boolean, nullable=False)
    scheduled_start_time: Mapped[str] = mapped_column(String(10), nullable=False)
    scheduled_end_time: Mapped[str] = mapped_column(String(10), nullable=False)
    additional_info: Mapped[str] = mapped_column(String, nullable=True)

    # Define relationships to children
    custom_country: Mapped['CustomCountry'] = relationship('CustomCountry', back_populates='major_stage', uselist=False, cascade='all')
    costs: Mapped[list['Costs']] = relationship('Costs', back_populates='major_stage', cascade='all, delete-orphan')
    transportations: Mapped[list['Transportation']] = relationship('Transportation', back_populates='major_stage', cascade='all, delete-orphan')
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
    costs: Mapped[list['Costs']] = relationship('Costs', back_populates='minor_stage', cascade='all, delete-orphan')
    transportations: Mapped[list['Transportation']] = relationship('Transportation', back_populates='minor_stage', cascade='all, delete-orphan')
    accommodations: Mapped[list['Accommodation']] = relationship('Accommodation', back_populates='minor_stage', cascade='all, delete-orphan')
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
    major_stage: Mapped['MajorStage'] = relationship('MajorStage', back_populates='transportations')
    minor_stage: Mapped['MinorStage'] = relationship('MinorStage', back_populates='transportations')

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
    minor_stage: Mapped['MinorStage'] = relationship('MinorStage', back_populates='accommodations')

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
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    custom_country_id: Mapped[int] = mapped_column(Integer, ForeignKey('custom_countries.id'), nullable=True)
    minor_stage_id: Mapped[int] = mapped_column(Integer, ForeignKey('minor_stages.id'), nullable=True)

    # Define the relationships to the parents
    user: Mapped['User'] = relationship('User', back_populates='places_to_visit')
    custom_country: Mapped['CustomCountry'] = relationship('CustomCountry', back_populates='places_to_visit')
    minor_stage: Mapped['MinorStage'] = relationship('MinorStage', back_populates='places_to_visit')