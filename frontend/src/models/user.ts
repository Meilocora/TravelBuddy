export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  journeysIds?: number[];
  countriesIds?: number[];
  // TODO: currentJourney
  // TODO: currentMajorStage
  // TODO. currentMinorStage
  // TODO: currentCountry
  // TODO: defaultCurrency
}
