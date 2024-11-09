import axios, { AxiosResponse } from 'axios';

import { Journey, MajorStage, MinorStage } from '../models';

const BACKEND_URL = 'http://192.168.178.32:3000';

interface JourneyResponse {
  journeys?: Journey[];
  status: number;
  error?: string;
}

interface FetchJourneysResponse {
  typedJourneys?: Journey[];
  status: number;
  error?: string;
}

export const fetchJourneys = async (): Promise<FetchJourneysResponse> => {
  try {
    const response: AxiosResponse<JourneyResponse> = await axios.get(
      `${BACKEND_URL}/get-journeys`
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    const { journeys, status } = response.data;

    if (!journeys) {
      return { status };
    }

    const typedJourneys = journeys.map((journey) => {
      return {
        ...journey,
        scheduled_start_time: new Date(journey.scheduled_start_time),
        scheduled_end_time: new Date(journey.scheduled_end_time),
      };
    });

    return { typedJourneys, status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not fetch journeys!' };
  }
};

interface MajorStageResponse {
  majorStages?: MajorStage[];
  status: number;
  error?: string;
}

interface FetchMajorStagesResponse {
  typedMajorStages?: MajorStage[];
  status: number;
  error?: string;
}

export const fetchMajorStagesById = async (
  id: number
): Promise<FetchMajorStagesResponse> => {
  try {
    const response: AxiosResponse<MajorStageResponse> = await axios.get(
      `${BACKEND_URL}/get-major-stages/${id}`
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    const { majorStages, status } = response.data;

    if (!majorStages) {
      return { status };
    }

    const typedMajorStages: MajorStage[] = majorStages.map((majorStage) => {
      return {
        id: majorStage.id,
        title: majorStage.title,
        country: majorStage.country,
        ...(majorStage.transportation && {
          transportation: {
            type: majorStage.transportation.type,
            start_time: new Date(majorStage.transportation.start_time),
            arrival_time: new Date(majorStage.transportation.arrival_time),
            place_of_departure: majorStage.transportation.place_of_departure,
            place_of_arrival: majorStage.transportation.place_of_arrival,
            transportation_costs:
              majorStage.transportation.transportation_costs,
            link: majorStage.transportation.link,
          },
        }),
        done: majorStage.done,
        scheduled_start_time: new Date(majorStage.scheduled_start_time),
        scheduled_end_time: new Date(majorStage.scheduled_end_time),
        costs: {
          available_money: majorStage.costs.available_money,
          planned_costs: majorStage.costs.planned_costs,
          money_exceeded: majorStage.costs.money_exceeded,
        },
        minorStagesIds: majorStage.minorStagesIds,
      };
    });

    return { typedMajorStages, status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not fetch journeys!' };
  }
};

interface MinorStageResponse {
  minorStages?: MinorStage[];
  status: number;
  error?: string;
}

interface FetchMinorStagesResponse {
  typedMinorStages?: MinorStage[];
  status: number;
  error?: string;
}

export const fetchMinorStagesById = async (
  id: number
): Promise<FetchMinorStagesResponse> => {
  try {
    const response: AxiosResponse<MinorStageResponse> = await axios.get(
      `${BACKEND_URL}/get-minor-stages/${id}`
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    const { minorStages, status } = response.data;

    if (!minorStages) {
      return { status };
    }

    const typedMinorStages: MinorStage[] = minorStages.map((minorStage) => {
      return {
        id: minorStage.id,
        title: minorStage.title,
        ...(minorStage.baseLocation && {
          baseLocation: {
            name: minorStage.baseLocation.name,
            description: minorStage.baseLocation.description,
            place: minorStage.baseLocation.place,
            costs: minorStage.baseLocation.costs,
            booked: minorStage.baseLocation.booked,
            link: minorStage.baseLocation.link,
          },
        }),
        placesToVisit: minorStage.placesToVisit?.map((place) => ({
          name: place.name,
          description: place.description,
          visited: place.visited,
          favorite: place.favorite,
          link: place.link,
        })),
        activities: minorStage.activities?.map((activity) => ({
          name: activity.name,
          description: activity.description,
          costs: activity.costs,
          booked: activity.booked,
          place: activity.place,
          link: activity.link,
        })),
        done: minorStage.done,
        scheduled_start_time: new Date(minorStage.scheduled_start_time),
        scheduled_end_time: new Date(minorStage.scheduled_end_time),
        costs: {
          available_money: minorStage.costs.available_money,
          planned_costs: minorStage.costs.planned_costs,
          money_exceeded: minorStage.costs.money_exceeded,
        },
      };
    });

    return { typedMinorStages, status };
  } catch (error) {
    // Error from frontend

    return { status: 500, error: 'Could not fetch major stages!' };
  }
};
