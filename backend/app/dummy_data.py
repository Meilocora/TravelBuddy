from models import Journey, MajorStage, MinorStage, Costs, Transportation, Accommodation, Activity, PlaceToVisit
from db import db

def add_dummy_data():
    # Create a Journey
    journey = Journey(
        name="European Adventure",
        description="A journey through Europe",
        scheduled_start_time="2023-10-01",
        scheduled_end_time="2023-10-15",
        countries="France, Germany, Italy",
        done=False
    )
    db.session.add(journey)
    db.session.commit()
    
    # Create MajorStages
    major_stage1 = MajorStage(
        title="Paris",
        scheduled_start_time="2023-10-01",
        scheduled_end_time="2023-10-05",
        country="France",
        done=False,
        journey_id=journey.id
    )
    major_stage2 = MajorStage(
        title="Berlin",
        scheduled_start_time="2023-10-06",
        scheduled_end_time="2023-10-10",
        country="Germany",
        done=False,
        journey_id=journey.id
    )
    db.session.add_all([major_stage1, major_stage2])
    db.session.commit()

    # Create MinorStages
    minor_stage1 = MinorStage(
        title="Eiffel Tower Visit",
        scheduled_start_time="2023-10-02",
        scheduled_end_time="2023-10-02",
        done=False,
        major_stage_id=major_stage1.id
    )
    minor_stage2 = MinorStage(
        title="Brandenburg Gate Visit",
        scheduled_start_time="2023-10-07",
        scheduled_end_time="2023-10-07",
        done=False,
        major_stage_id=major_stage2.id
    )
    db.session.add_all([minor_stage1, minor_stage2])
    db.session.commit()

    # Create Costs
    costs1 = Costs(
        available_money=5000,
        planned_costs=4500,
        money_exceeded=False,
        journey_id=journey.id
    )
    costs2 = Costs(
        available_money=2000,
        planned_costs=1800,
        money_exceeded=False,
        major_stage_id=major_stage1.id
    )
    costs3 = Costs(
        available_money=1000,
        planned_costs=900,
        money_exceeded=False,
        minor_stage_id=minor_stage1.id
    )
    db.session.add_all([costs1, costs2, costs3])
    db.session.commit()

    # Create Transportation for MajorStage
    transportation_major1 = Transportation(
        type="Flight",
        start_time="2023-10-01 08:00",
        arrival_time="2023-10-01 10:00",
        place_of_departure="New York",
        place_of_arrival="Paris",
        transportation_costs=800,
        link="https://example.com",
        major_stage_id=major_stage1.id
    )
    transportation_major2 = Transportation(
        type="Flight",
        start_time="2023-10-01 08:00",
        arrival_time="2023-10-01 10:00",
        place_of_departure="New York",
        place_of_arrival="Paris",
        transportation_costs=800,
        link="https://example.com",
        major_stage_id=major_stage2.id
    )
    db.session.add(transportation_major1, transportation_major2)
    db.session.commit()

    # Create Transportation for MinorStage
    transportation_minor = Transportation(
        type="Bus",
        start_time="2023-10-02 09:00",
        arrival_time="2023-10-02 09:30",
        place_of_departure="Hotel Paris",
        place_of_arrival="Eiffel Tower",
        transportation_costs=20,
        link="https://example.com",
        minor_stage_id=minor_stage1.id
    )
    db.session.add(transportation_minor)
    db.session.commit()

    # Create Accommodation
    accommodation = Accommodation(
        name="Hotel Paris",
        description="A nice hotel in Paris",
        latitude=48.8566,
        longitude=2.3522,
        place="Paris",
        costs=500,
        booked=True,
        link="https://example.com",
        minor_stage_id=minor_stage1.id
    )
    db.session.add(accommodation)
    db.session.commit()

    # Create Activities
    activity = Activity(
        name="Louvre Museum Visit",
        description="Visit the famous Louvre Museum",
        costs=50,
        booked=True,
        place="Paris",
        link="https://example.com",
        minor_stage_id=minor_stage1.id
    )
    db.session.add(activity)
    db.session.commit()

    # Create Places to Visit
    place_to_visit = PlaceToVisit(
        name="Notre Dame Cathedral",
        description="Visit the historic Notre Dame Cathedral",
        latitude=48.853,
        longitude=2.3499,
        visited=False,
        favorite=True,
        link="https://example.com",
        minor_stage_id=minor_stage1.id
    )
    db.session.add(place_to_visit)
    db.session.commit()