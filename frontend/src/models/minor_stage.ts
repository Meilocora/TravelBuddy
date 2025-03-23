import { Costs, Transportation, Validable } from './other_models';
import { PlaceToVisit } from './place';

export interface MinorStage {
  id: number;
  title: string;
  done: boolean;
  scheduled_start_time: string;
  scheduled_end_time: string;
  costs: Costs;
  transportation?: Transportation;
  accommodation: Accommodation;
  activities?: Activity[];
  placesToVisit?: PlaceToVisit[];
}

export interface MinorStageValues {
  title: string;
  done: boolean;
  scheduled_start_time: string | null;
  scheduled_end_time: string | null;
  budget: number;
  spent_money: number;
  accommodation_name: string | null;
  accommodation_description: string | null;
  accommodation_place: string | null;
  accommodation_costs: number | null;
  accommodation_booked: boolean;
  accommodation_link: string | null;
}

export interface MinorStageFormValues {
  title: Validable<string>;
  done: Validable<boolean>;
  scheduled_start_time: Validable<string | null>;
  scheduled_end_time: Validable<string | null>;
  budget: Validable<number>;
  spent_money: Validable<number>;
  accommodation_name: Validable<string | null>;
  accommodation_description: Validable<string | null>;
  accommodation_place: Validable<string | null>;
  accommodation_costs: Validable<number | null>;
  accommodation_booked: Validable<boolean>;
  accommodation_link: Validable<string | null>;
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
