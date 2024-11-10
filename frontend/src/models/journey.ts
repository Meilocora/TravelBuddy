export interface Journey {
  id: number;
  name: string;
  description: string;
  costs: Costs;
  scheduled_start_time: Date;
  scheduled_end_time: Date;
  countries?: string[];
  done: boolean;
  majorStagesIds?: number[];
}

export interface JourneyValues {
  name: string;
  description: string;
  available_money: number;
  planned_costs: number;
  scheduled_start_time: Date | null;
  scheduled_end_time: Date | null;
  countries: string[];
}

export interface JourneyFormValues {
  name: { value: string; isValid: boolean };
  description: { value: string; isValid: boolean };
  available_money: { value: number; isValid: boolean };
  planned_costs: { value: number; isValid: boolean };
  scheduled_start_time: { value: Date | null; isValid: boolean };
  scheduled_end_time: { value: Date | null; isValid: boolean };
  countries: { value: string[]; isValid: boolean };
}

export interface Costs {
  available_money: number;
  planned_costs: number;
  money_exceeded: boolean;
}
