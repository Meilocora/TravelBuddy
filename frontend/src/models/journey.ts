export interface Journey {
  id: number;
  name: string;
  description: string;
  costs: Costs;
  scheduled_start_time: Date;
  scheduled_end_time: Date;
  countries: string[];
  done: boolean;
  majorStagesIds: number[];
}

export interface Costs {
  available_money: number;
  planned_costs: number;
  money_exceeded: boolean;
}
