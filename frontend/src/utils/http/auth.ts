import axios, { AxiosResponse } from 'axios';

import { BACKEND_URL } from './backend_url';
import { AuthFormValues } from '../../models';
import { formatStringToList } from '../formatting';

const prefix = `${BACKEND_URL}/auth`;

interface UserCreationProps {
  status: number;
  error?: string;
  authFormValues?: AuthFormValues;
}

export const createUser = async (
  authFormValues: AuthFormValues
): Promise<UserCreationProps> => {
  try {
    const response: AxiosResponse<UserCreationProps> = await axios.post(
      `${prefix}/create-user`,
      authFormValues
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    if (response.data.authFormValues) {
      return {
        authFormValues: response.data.authFormValues,
        status: response.data.status,
      };
    }

    return { status: response.data.status };
  } catch (error) {
    return { status: 500, error: 'Could not create user!' };
  }
};

export const loginUser = async (
  authFormValues: AuthFormValues
): Promise<UserCreationProps> => {
  try {
    const response: AxiosResponse<UserCreationProps> = await axios.post(
      `${prefix}/login-user`,
      authFormValues
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    if (response.data.authFormValues) {
      return {
        authFormValues: response.data.authFormValues,
        status: response.data.status,
      };
    }

    return { status: response.data.status };
  } catch (error) {
    return { status: 500, error: 'Could not login user!' };
  }
};
