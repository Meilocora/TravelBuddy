import axios, { AxiosResponse } from 'axios';

import { BACKEND_URL } from '@env';
import { MajorStage } from '../../models';

const prefix = `${BACKEND_URL}/major_stage`;

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
      `${prefix}/get-major-stages/${id}`
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
