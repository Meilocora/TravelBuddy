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
