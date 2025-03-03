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

export interface TransportationValues {
  type: Validable<TransportationType>;
  start_time: Validable<string | null>;
  arrival_time: Validable<string | null>;
  place_of_departure: Validable<string | undefined>;
  place_of_arrival: Validable<string | undefined>;
  transportation_costs: Validable<number | undefined>;
  link: Validable<string | undefined>;
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
