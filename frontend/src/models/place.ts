import { Validable } from './other_models';

export interface PlaceToVisit {
  countryId: number;
  id: number;
  name: string;
  description: string;
  visited: boolean;
  favorite: boolean;
  link?: string;
  maps_link?: string;
}

export interface PlaceValues {
  countryId: number;
  name: string;
  description: string;
  visited: boolean;
  favorite: boolean;
  link?: string;
  maps_link?: string;
}

export interface PlaceFormValues {
  countryId: Validable<number>;
  name: Validable<string>;
  description: Validable<string>;
  visited: Validable<boolean>;
  favorite: Validable<boolean>;
  link: Validable<string>;
  maps_link: Validable<string>;
}
