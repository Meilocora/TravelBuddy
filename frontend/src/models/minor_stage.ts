import { Costs, Transportation, Validable } from './other_models';
import { PlaceToVisit } from './place';

export interface MinorStage {
  id: number;
  title: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  done: boolean;
  costs: Costs;
  transportation?: Transportation;
  accommodation?: Accommodation;
  activities?: Activity[];
  placesToVisit?: PlaceToVisit[];
}

export interface MinorStageValues {
  title: string;
  scheduled_start_time: string | null;
  scheduled_end_time: string | null;
  done: boolean;
  spent_money: number;
}

export interface MinorStageFormValues {
  title: Validable<string>;
  scheduled_start_time: Validable<string | null>;
  scheduled_end_time: Validable<string | null>;
  done: Validable<boolean>;
  spent_money: Validable<number>;
}

export interface Accommodation {
  name: string;
  description: string;
  place: string;
  costs: number;
  booked: boolean;
  link: string;
}

export interface Activity {
  name: string;
  description: string;
  costs: number;
  booked: boolean;
  place: string;
  link: string;
}
