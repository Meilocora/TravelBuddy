import axios, { AxiosResponse } from 'axios';

import { MajorStage } from '../../models';
import { BACKEND_URL } from './backend_url';

interface FetchMajorStageProps {
  majorStages?: MajorStage[];
  status: number;
  error?: string;
}

export const fetchMajorStagesById = async (
  id: number
): Promise<FetchMajorStageProps> => {
  try {
    const response: AxiosResponse<FetchMajorStageProps> = await axios.get(
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

    return { majorStages, status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not fetch journeys!' };
  }
};
