import { Costs, Transportation } from './other_models';
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
