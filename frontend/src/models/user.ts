import { Journey } from './journey';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  token?: string;
  journeys?: Journey[];
}
