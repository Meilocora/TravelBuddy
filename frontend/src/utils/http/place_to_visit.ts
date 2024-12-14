import { AxiosResponse } from 'axios';

import { BACKEND_URL } from '@env';
import { PlaceFormValues, PlaceToVisit } from '../../models';
import api from './api';

interface FetchPlacesProps {
  places?: PlaceToVisit[];
  status: number;
  error?: string;
}

const prefix = `${BACKEND_URL}/place-to-visit`;

export const fetchPlaces = async (): Promise<FetchPlacesProps> => {
  try {
    const response: AxiosResponse<FetchPlacesProps> = await api.get(
      `${prefix}/get-places`
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    const { places, status } = response.data;

    if (!places) {
      return { status };
    }

    return { places, status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not fetch places!' };
  }
};

interface ManagePlaceProps {
  place?: PlaceToVisit;
  placeFormValues?: PlaceFormValues;
  status: number;
  error?: string;
}

export const createPlace = async (
  placeFormValues: PlaceFormValues
): Promise<ManagePlaceProps> => {
  try {
    const response: AxiosResponse<ManagePlaceProps> = await api.post(
      `${prefix}/create-place`,
      placeFormValues
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    if (response.data.placeFormValues) {
      return {
        placeFormValues: response.data.placeFormValues,
        status: response.data.status,
      };
    }

    return { place: response.data.place, status: response.data.status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not create place!' };
  }
};

export const updatePlace = async (
  placeFormValues: PlaceFormValues,
  placeId: number
): Promise<ManagePlaceProps> => {
  try {
    const response: AxiosResponse<ManagePlaceProps> = await api.post(
      `${prefix}/update-place/${placeId}`,
      placeFormValues
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    if (response.data.placeFormValues) {
      return {
        placeFormValues: response.data.placeFormValues,
        status: response.data.status,
      };
    }

    return { place: response.data.place, status: response.data.status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not update place!' };
  }
};

export const deletePlace = async (
  placeId: number
): Promise<ManagePlaceProps> => {
  try {
    const response: AxiosResponse<ManagePlaceProps> = await api.delete(
      `${prefix}/delete-place/${placeId}`
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    return { status: response.data.status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not delete place!' };
  }
};
