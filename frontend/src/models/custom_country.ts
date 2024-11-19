import { PlaceToVisit } from './other_models';

export interface CustomCountry {
  id: number;
  name: string;
  code: string;
  timezone: string;
  currency: string;
  language: string;
  capital: string;
  visited: boolean;
  visum_regulations?: string;
  best_time_to_visit?: string;
  general_information?: string;
  JourneyIds?: number[];
  placesToVisit?: PlaceToVisit[];
}
