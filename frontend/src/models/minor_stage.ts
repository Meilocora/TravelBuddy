import { Costs } from './journey';

export interface MinorStage {
  id: number;
  title: string;
  baseLocation?: Accommodation;
  placesToVisit?: PlaceToVisit[];
  activities?: Activity[];
  done: boolean;
  scheduled_start_time: Date;
  scheduled_end_time: Date;
  costs: Costs;
}

export interface Accommodation {
  name: string;
  description: string;
  place: string;
  costs: number;
  booked: boolean;
  link: string;
}

export interface PlaceToVisit {
  name: string;
  description: string;
  visited: boolean;
  favorite: boolean;
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
