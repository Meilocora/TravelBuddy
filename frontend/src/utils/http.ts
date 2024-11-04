import axios, { AxiosResponse } from 'axios';

import { Journey, MajorStage } from '../models';

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
        transportation: {
          type: majorStage.transportation.type,
          start_time: new Date(majorStage.transportation.start_time),
          arrival_time: new Date(majorStage.transportation.arrival_time),
          place_of_departure: majorStage.transportation.place_of_departure,
          place_of_arrival: majorStage.transportation.place_of_arrival,
          transportation_costs: majorStage.transportation.transportation_costs,
          link: majorStage.transportation.link,
        },
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

//TODO: fetchMinorStagesById
