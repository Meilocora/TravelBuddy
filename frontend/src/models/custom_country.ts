import { PlaceToVisit } from './other_models';

export interface CustomCountry {
  id?: number;
  name: string;
  code: string;
  timezones: string;
  currencies: string;
  languagees: string;
  capital: string;
  population: number;
  region: string;
  subregion: string;
  wiki_link: string;
  visited?: boolean;
  visum_regulations?: string;
  best_time_to_visit?: string;
  general_information?: string;
  JourneyIds?: number[];
  placesToVisit?: PlaceToVisit[];
}
