export interface Costs {
  available_money: number;
  planned_costs: number;
  money_exceeded: boolean;
}

export interface Transportation {
  type: TransportationType;
  start_time: string;
  arrival_time: string;
  place_of_departure: string;
  place_of_arrival: string;
  transportation_costs: number;
  link: string;
}

export enum TransportationType {
  plane,
  bus,
  train,
  ferry,
  other,
}

export interface Validable<T> {
  value: T;
  isValid: boolean;
  errors: string[];
}
