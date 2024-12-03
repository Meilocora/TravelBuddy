import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';

export type BottomTabsParamList = {
  AllJourneys: undefined | { popupText?: string };
  ManageJourney: { journeyId?: number };
  Locations: undefined;
  UserProfile: undefined;
};

export type JourneyBottomTabsParamsList = {
  Planning: { journeyId: number; journeyName: string };
  Overview: undefined;
  Map: undefined;
};

export type StackParamList = {
  AuthStackNavigator: NavigatorScreenParams<AuthStackParamList>;
  BottomTabsNavigator: NavigatorScreenParams<BottomTabsParamList>;
  UserProfile: undefined;
  JourneyBottomTabsNavigator: NavigatorScreenParams<JourneyBottomTabsParamsList>;
  ManageCustomCountry: { countryId: number };
};

export type AuthStackParamList = {
  AuthScreen: undefined;
};

export type PlanningRouteProp = RouteProp<
  JourneyBottomTabsParamsList,
  'Planning'
>;
export type UserProfileRouteProp = RouteProp<StackParamList, 'UserProfile'>;

export type ManageJourneyRouteProp = RouteProp<
  BottomTabsParamList,
  'ManageJourney'
>;

export type ManageCustomCountryRouteProp = RouteProp<
  StackParamList,
  'ManageCustomCountry'
>;
