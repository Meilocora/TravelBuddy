import axios, { AxiosResponse } from 'axios';

import { BACKEND_URL } from './backend_url';
import { AuthFormValues } from '../../models';

interface UserCreationProps {
  status: number;
  error?: string;
  userFormValues?: AuthFormValues;
}

export const createUser = async (
  userFormValues: AuthFormValues
): Promise<UserCreationProps> => {
  try {
    const response: AxiosResponse<UserCreationProps> = await axios.post(
      `${BACKEND_URL}/create-user`,
      userFormValues
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    if (response.data.userFormValues) {
      return {
        userFormValues: response.data.userFormValues,
        status: response.data.status,
      };
    }

    return { status: response.data.status };
  } catch (error) {
    return { status: 500, error: 'Could not create user!' };
  }
};
