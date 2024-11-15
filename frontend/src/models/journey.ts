export interface Journey {
  id: number;
  name: string;
  description: string;
  costs: Costs;
  scheduled_start_time: string;
  scheduled_end_time: string;
  countries: string;
  done: boolean;
  majorStagesIds?: number[];
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

interface Validable<T> {
  value: T;
  isValid: boolean;
  errors: string[];
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

export interface Costs {
  available_money: number;
  planned_costs: number;
  money_exceeded: boolean;
}

export interface Country {}
