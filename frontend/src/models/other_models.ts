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
  transportation = 'Transportation',
  acommodation = 'Acommodation',
  activities = 'Activities',
  dine_out = 'Dine out',
  basic_needs = 'Basic needs',
  souvenirs = 'Souvenirs',
  other = 'Other',
}

export interface Transportation {
  id: number;
  type: string;
  start_time: string;
  arrival_time: string;
  place_of_departure: string;
  place_of_arrival: string;
  transportation_costs: number;
  link: string;
}

export interface TransportationValues {
  type: string;
  start_time: string;
  arrival_time: string;
  place_of_departure: string;
  place_of_arrival: string;
  transportation_costs: number;
  link: string;
}

export interface TransportationFormValues {
  type: Validable<string>;
  start_time: Validable<string | null>;
  arrival_time: Validable<string | null>;
  place_of_departure: Validable<string | undefined>;
  place_of_arrival: Validable<string | undefined>;
  transportation_costs: Validable<number>;
  link: Validable<string | undefined>;
}

export enum TransportationType {
  bus = 'Bus',
  car = 'Car',
  ferry = 'Ferry',
  plane = 'Plane',
  train = 'Train',
  other = 'Other',
}

export interface Validable<T> {
  value: T;
  isValid: boolean;
  errors: string[];
}
