import { AxiosResponse } from 'axios';

import { BACKEND_URL } from '@env';
import { Journey, JourneyFormValues } from '../../models';
import api from './api';
import { getCurrentLocation } from '../location';

interface FetchJourneysProps {
  journeys?: Journey[];
  offset?: number;
  localCurrency?: string;
  conversionRate?: number;
  status: number;
  error?: string;
}

const prefix = `${BACKEND_URL}/journey`;

// TODO: Get currentLocation as input from userContext
export const fetchStagesData = async (
  hasPermission: boolean
): Promise<FetchJourneysProps> => {
  let currentLocation: { latitude: number; longitude: number } | undefined;
  if (hasPermission) {
    currentLocation = await getCurrentLocation();
  } else {
    currentLocation = undefined;
  }

  // TODO: Delete after successfull testing
  currentLocation = { latitude: 33.261, longitude: -86.67 };
  try {
    const response: AxiosResponse<FetchJourneysProps> = await api.get(
      `${prefix}/get-stages-data`,
      {
        params: currentLocation,
      }
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    const { journeys, offset, localCurrency, conversionRate, status } =
      response.data;

    if (!journeys) {
      return { status };
    }

    // TODO: make another http request fot getting offset, localCurrency and conversionRate
    return { journeys, offset, localCurrency, conversionRate, status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not fetch data!' };
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
    const response: AxiosResponse<ManageJourneyProps> = await api.post(
      `${prefix}/create-journey`,
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
    const response: AxiosResponse<ManageJourneyProps> = await api.post(
      `${prefix}/update-journey/${journeyId}`,
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
    const response: AxiosResponse<ManageJourneyProps> = await api.delete(
      `${prefix}/delete-journey/${journeyId}`
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
