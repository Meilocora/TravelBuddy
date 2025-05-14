import { AxiosResponse } from 'axios';

import { BACKEND_URL } from '@env';
import { Journey, JourneyFormValues, TransportationType } from '../../models';
import api from './api';

interface FetchJourneysProps {
  journeys?: Journey[];
  status: number;
  error?: string;
}

const prefix = `${BACKEND_URL}/journey`;

export const fetchStagesData = async (): Promise<FetchJourneysProps> => {
  try {
    const response: AxiosResponse<FetchJourneysProps> = await api.get(
      `${prefix}/get-stages-data`
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
    return { status: 500, error: 'Could not fetch data!' };
  }
};

export const fetchJourneys = async (): Promise<FetchJourneysProps> => {
  try {
    const response: AxiosResponse<FetchJourneysProps> = await api.get(
      `${prefix}/get-journeys`
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

interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
}

export enum LocationType {
  transportation_departure = 'transportation_departure',
  transportation_arrival = 'transportation_arrival',
  accommodation = 'accommodation',
  activity = 'activity',
  placeToVisit = 'placeToVisit',
}

export interface Location {
  belonging: string;
  locationType: LocationType;
  data: LocationData;
  minorStageName?: string;
  description?: string;
  transportationType?: TransportationType;
  color?: string;
}

interface FetchJourneysLocationsProps {
  locations?: Location[];
  majorStageNames?: string[];
  status: number;
  error?: string;
}

export const fetchJourneysLocations = async (
  journeyId: number
): Promise<FetchJourneysLocationsProps> => {
  try {
    const response: AxiosResponse<FetchJourneysLocationsProps> = await api.get(
      `${prefix}/get-journeys-locations/${journeyId}`
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    const { locations, majorStageNames, status } = response.data;

    if (!locations) {
      return { status };
    }

    return { locations, majorStageNames, status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not fetch locations!' };
  }
};
