import axios from 'axios';

import { Journey } from '../models';

const BACKEND_URL = 'http://192.168.178.32:3000';

interface JourneyResponse {
  journeys?: Journey[];
  status: string;
}

export const fetchJourneys = async (): Promise<any> => {
  const response = await axios.get(`${BACKEND_URL}/get-journeys`);

  console.log(response.data);
  // const journeys: Journey[] = response.data;
  return;
};
