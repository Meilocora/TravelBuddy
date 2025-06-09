import axios, { AxiosResponse } from 'axios';

import { BACKEND_URL } from '@env';
import { AuthFormValues } from '../../models';

const prefix = `${BACKEND_URL}/auth`;

interface UserCreationProps {
  status: number;
  error?: string;
  authFormValues?: AuthFormValues;
  token?: string;
  refreshToken?: string;
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

    return {
      token: response.data.token,
      refreshToken: response.data.refreshToken,
      status: response.data.status,
    };
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

    return {
      token: response.data.token,
      refreshToken: response.data.refreshToken,
      status: response.data.status,
    };
  } catch (error) {
    return { status: 500, error: 'Could not login user!' };
  }
};

interface RefreshTokenProps {
  token?: string;
  newToken?: string;
  refreshToken?: string;
  newRefreshToken?: string;
  error?: string;
  status: number;
}

export const refreshAuthToken = async (
  refreshToken: string
): Promise<RefreshTokenProps> => {
  try {
    const response: AxiosResponse<RefreshTokenProps> = await axios.post(
      `${prefix}/refresh-token`,
      { refreshToken }
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    return {
      newToken: response.data.newToken,
      newRefreshToken: response.data.newRefreshToken,
      status: response.data.status,
    };
  } catch (error) {
    return { status: 500, error: 'Could not refresh token!' };
  }
};
