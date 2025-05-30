import { AxiosResponse } from 'axios';

import { BACKEND_URL } from '@env';
import { MajorStage, MajorStageFormValues } from '../../models';
import api from './api';

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
    const response: AxiosResponse<FetchMajorStageProps> = await api.get(
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
    return { status: 500, error: 'Could not fetch major stages!' };
  }
};

interface ManageMajorStageProps {
  majorStage?: MajorStage;
  majorStageFormValues?: MajorStageFormValues;
  status: number;
  error?: string;
}

export const createMajorStage = async (
  journeyId: number,
  majorStageFormValues: MajorStageFormValues
): Promise<ManageMajorStageProps> => {
  try {
    const response: AxiosResponse<ManageMajorStageProps> = await api.post(
      `${prefix}/create-major-stage/${journeyId}`,
      majorStageFormValues
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    if (response.data.majorStageFormValues) {
      return {
        majorStageFormValues: response.data.majorStageFormValues,
        status: response.data.status,
      };
    }

    return {
      majorStage: response.data.majorStage,
      status: response.data.status,
    };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not create major stage!' };
  }
};

export const updateMajorStage = async (
  journeyId: number,
  majorStageFormValues: MajorStageFormValues,
  majorStageId: number
): Promise<ManageMajorStageProps> => {
  try {
    const response: AxiosResponse<ManageMajorStageProps> = await api.post(
      `${prefix}/update-major-stage/${journeyId}/${majorStageId}`,
      majorStageFormValues
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    if (response.data.majorStageFormValues) {
      return {
        majorStageFormValues: response.data.majorStageFormValues,
        status: response.data.status,
      };
    }

    return {
      majorStage: response.data.majorStage,
      status: response.data.status,
    };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not update major stage!' };
  }
};

export const deleteMajorStage = async (
  majorStageId: number
): Promise<ManageMajorStageProps> => {
  try {
    const response: AxiosResponse<ManageMajorStageProps> = await api.delete(
      `${prefix}/delete-major-stage/${majorStageId}`
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    return { status: response.data.status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not delete major stage!' };
  }
};
