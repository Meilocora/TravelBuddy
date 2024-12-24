import { Costs, Validable } from './other_models';

export interface Journey {
  id: number;
  name: string;
  description: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  done: boolean;
  majorStagesIds?: number[];
  costs: Costs;
  countries: string;
}

export interface JourneyValues {
  name: string;
  description: string;
  available_money: number;
  planned_costs: number;
  scheduled_start_time: string | null;
  scheduled_end_time: string | null;
  countries: string;
}

export interface JourneyFormValues {
  name: Validable<string>;
  description: Validable<string>;
  available_money: Validable<number>;
  planned_costs: Validable<number>;
  scheduled_start_time: Validable<string | null>;
  scheduled_end_time: Validable<string | null>;
  countries: Validable<string>;
}
