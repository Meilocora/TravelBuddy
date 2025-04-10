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
  accommodation_place: string;
  accommodation_costs: number | null;
  accommodation_booked: boolean;
  accommodation_link: string;
  accommodation_maps_link: string;
}

export interface MinorStageFormValues {
  title: Validable<string>;
  done: Validable<boolean>;
  scheduled_start_time: Validable<string | null>;
  scheduled_end_time: Validable<string | null>;
  budget: Validable<number>;
  spent_money: Validable<number>;
  accommodation_place: Validable<string>;
  accommodation_costs: Validable<number>;
  accommodation_booked: Validable<boolean>;
  accommodation_link: Validable<string>;
  accommodation_maps_link: Validable<string>;
}

export interface Accommodation {
  place: string;
  costs: number;
  booked: boolean;
  link: string;
  maps_link: string;
}

export interface Activity {
  id?: number;
  name: string;
  description: string;
  costs: number;
  booked: boolean;
  place: string;
  link: string;
}

export interface ActivityFormValues {
  name: Validable<string>;
  description: Validable<string>;
  costs: Validable<number>;
  booked: Validable<boolean>;
  place: Validable<string>;
  link: Validable<string>;
}
