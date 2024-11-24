import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BACKEND_URL } from '@env';

const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
