import axios, { AxiosResponse } from 'axios';

import { MinorStage } from '../../models';

const BACKEND_URL = process.env.BACKEND_URL;
const prefix = `${BACKEND_URL}/minor_stage`;

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
      `${prefix}/get-minor-stages/${id}`
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
