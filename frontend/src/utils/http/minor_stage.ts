import axios, { AxiosResponse } from 'axios';

import { MinorStage } from '../../models';
import { BACKEND_URL } from './backend_url';

interface FetchMinorStagesProps {
  minorStages?: MinorStage[];
  status: number;
  error?: string;
}

export const fetchMinorStagesById = async (
  id: number
): Promise<FetchMinorStagesProps> => {
  try {
    const response: AxiosResponse<FetchMinorStagesProps> = await axios.get(
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

    return { minorStages, status };
  } catch (error) {
    // Error from frontend

    return { status: 500, error: 'Could not fetch major stages!' };
  }
};
