import axios, { AxiosResponse } from 'axios';

import { Journey, JourneyFormValues } from '../../models';
import { BACKEND_URL } from './backend_url';

interface FetchJourneysProps {
  journeys?: Journey[];
  status: number;
  error?: string;
}

export const fetchJourneys = async (): Promise<FetchJourneysProps> => {
  try {
    const response: AxiosResponse<FetchJourneysProps> = await axios.get(
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

    return { journeys, status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not fetch journeys!' };
  }
};

interface ManageJourneyProps {
  journey?: Journey;
  journeyFormValues?: JourneyFormValues;
  status: number;
  error?: string;
}

export const createJourney = async (
  journeyFormValues: JourneyFormValues
): Promise<ManageJourneyProps> => {
  try {
    const response: AxiosResponse<ManageJourneyProps> = await axios.post(
      `${BACKEND_URL}/create-journey`,
      journeyFormValues
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    if (response.data.journeyFormValues) {
      return {
        journeyFormValues: response.data.journeyFormValues,
        status: response.data.status,
      };
    }

    return { journey: response.data.journey, status: response.data.status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not create journey!' };
  }
};

export const updateJourney = async (
  journeyFormValues: JourneyFormValues,
  journeyId: number
): Promise<ManageJourneyProps> => {
  try {
    const response: AxiosResponse<ManageJourneyProps> = await axios.post(
      `${BACKEND_URL}/update-journey/${journeyId}`,
      journeyFormValues
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    if (response.data.journeyFormValues) {
      return {
        journeyFormValues: response.data.journeyFormValues,
        status: response.data.status,
      };
    }

    return { journey: response.data.journey, status: response.data.status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not update journey!' };
  }
};

export const deleteJourney = async (
  journeyId: number
): Promise<ManageJourneyProps> => {
  try {
    const response: AxiosResponse<ManageJourneyProps> = await axios.delete(
      `${BACKEND_URL}/delete-journey/${journeyId}`
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    return { status: response.data.status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not delete journey!' };
  }
};