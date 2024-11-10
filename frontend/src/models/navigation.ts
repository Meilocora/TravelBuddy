import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';

export type BottomTabsParamList = {
  AllJourneys: undefined;
  ManageJourney: undefined;
  Camera: undefined;
  UserProfile: undefined;
  Favorites: undefined;
};

export type JourneyBottomTabsParamsList = {
  Planning: { journeyId: number; journeyName: string };
  Overview: undefined;
  Map: undefined;
};

export type StackParamList = {
  BottomTabsNavigator: NavigatorScreenParams<BottomTabsParamList>;
  UserProfile: undefined;
  JourneyBottomTabsNavigator: NavigatorScreenParams<JourneyBottomTabsParamsList>;
};

export type PlanningRouteProp = RouteProp<
  JourneyBottomTabsParamsList,
  'Planning'
>;
export type UserProfileRouteProp = RouteProp<StackParamList, 'UserProfile'>;
