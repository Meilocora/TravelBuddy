export interface Costs {
  budget: number;
  spent_money: number;
  money_exceeded: boolean;
  spendings: Spendings[] | null;
}

export interface Spendings {
  name: string;
  amount: number;
  date: string;
  category: SpendingsCategory;
}

export enum SpendingsCategory {
  transportation,
  acommodation,
  activities,
  dine_out,
  basic_needs,
  souvenirs,
  other,
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
