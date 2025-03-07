import { AxiosResponse } from 'axios';

import { BACKEND_URL } from '@env';
import { Transportation, TransportationFormValues } from '../../models';
import api from './api';

const prefix = `${BACKEND_URL}/transportation`;

interface ManageTransportProps {
  transportation?: Transportation;
  transportationFormValues?: TransportationFormValues;
  status: number;
  error?: string;
}

export const createMajorStage = async (
  transportationFormValues: TransportationFormValues,
  majorStageId?: number,
  minorStageId?: number
): Promise<ManageTransportProps> => {
  try {
    let response: AxiosResponse<ManageTransportProps>;
    if (majorStageId) {
      response = await api.post(
        `${prefix}/create-major-stage-transportation/${majorStageId}`,
        transportationFormValues
      );
    } else if (minorStageId) {
      response = await api.post(
        `${prefix}/create-minor-stage-transportation/${minorStageId}`,
        transportationFormValues
      );
    }

    // Error from backend
    if (response!.data.error) {
      return { status: response!.data.status, error: response!.data.error };
    }

    if (response!.data.transportationFormValues) {
      return {
        transportationFormValues: response!.data.transportationFormValues,
        status: response!.data.status,
      };
    }

    return {
      transportation: response!.data.transportation,
      status: response!.data.status,
    };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not create transportation!' };
  }
};

export const updateTransportation = async (
  transportationFormValues: TransportationFormValues,
  transportationId: number,
  majorStageId?: number,
  minorStageId?: number
): Promise<ManageTransportProps> => {
  try {
    let response: AxiosResponse<ManageTransportProps>;
    if (majorStageId) {
      response = await api.post(
        `${prefix}/update-major-stage-transportation/${majorStageId}/${transportationId}`,
        transportationFormValues
      );
    } else if (minorStageId) {
      response = await api.post(
        `${prefix}/update-minor-stage-transportation/${minorStageId}/${transportationId}`,
        transportationFormValues
      );
    }

    // Error from backend
    if (response!.data.error) {
      return { status: response!.data.status, error: response!.data.error };
    }

    if (response!.data.transportationFormValues) {
      return {
        transportationFormValues: response!.data.transportationFormValues,
        status: response!.data.status,
      };
    }

    return {
      transportation: response!.data.transportation,
      status: response!.data.status,
    };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not update transportation!' };
  }
};

export const deleteTransportation = async (
  majorStageId?: number,
  minorStageId?: number
): Promise<ManageTransportProps> => {
  try {
    let response: AxiosResponse<ManageTransportProps>;
    if (majorStageId) {
      response = await api.delete(
        `${prefix}/delete-major-stage-transportation/${majorStageId}`
      );
    } else if (minorStageId) {
      response = await api.delete(
        `${prefix}/delete-minor-stage-transportation/${minorStageId}`
      );
    }

    // Error from backend
    if (response!.data.error) {
      return { status: response!.data.status, error: response!.data.error };
    }

    return { status: response!.data.status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not delete transportation!' };
  }
};
