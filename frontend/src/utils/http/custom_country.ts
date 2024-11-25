import { AxiosResponse } from 'axios';

import { BACKEND_URL } from '@env';
import { CustomCountry } from '../../models';
import api from './api';

export interface FetchCountriesProps {
  countries?: string[];
  status: number;
  error?: string;
}

const prefix = `${BACKEND_URL}/country`;

export const fetchCountries = async (
  countryName: string
): Promise<FetchCountriesProps> => {
  try {
    const response: AxiosResponse<FetchCountriesProps> = await api.get(
      `${prefix}/get-countries/${countryName}`
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    const { countries, status } = response.data;

    if (!countries) {
      return { status };
    }

    return { countries, status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not fetch countries!' };
  }
};

export interface AddCountryProps {
  status: number;
  error?: string;
}

export const addCountry = async (
  countryName: string
): Promise<AddCountryProps> => {
  try {
    const response: AxiosResponse<AddCountryProps> = await api.post(
      `${prefix}/create-custom-country`,
      { countryName }
    );

    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    return { status: response.data.status };
  } catch (error) {
    return { status: 500, error: 'Could not add country!' };
  }
};
