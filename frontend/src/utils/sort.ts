import { Location } from './http';

export function sortMajorStages(locations: Location[]): Location[] {
  // locations.sort((a, b) => {
  //   if (a.belonging < b.belonging) return -1;
  //   if (a.belonging > b.belonging) return 1;
  return locations;
}

// TODO: Sort by:
//  belonging OR if scope = majorStage => minorStageName
//  locationType => transport_departure, transport_arrival, accommodation, placeToVisit, activity
