import axios, { AxiosResponse } from 'axios';

import { Journey } from '../models';

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
