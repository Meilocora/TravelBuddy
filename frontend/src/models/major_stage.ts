import { Costs } from './journey';

export interface MajorStage {
  id: number;
  title: string;
  country: string;
  transportation?: Transportation;
  done: boolean;
  scheduled_start_time: Date;
  scheduled_end_time: Date;
  costs: Costs;
  minorStagesIds?: number[];
}

export interface Transportation {
  type: TransportationType;
  start_time: Date;
  arrival_time: Date;
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
