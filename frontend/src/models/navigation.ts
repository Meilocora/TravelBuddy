import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';

export type BottomTabsParamList = {
  AllJourneys: undefined;
  AddJourney: undefined;
  Camera: undefined;
  UserProfile: undefined;
};

export type StackParamList = {
  BottomTabsNavigator: NavigatorScreenParams<BottomTabsParamList>;
  UserProfile: undefined;
  Planning: { journeyId: number; journeyName: string };
};

export type PlanningRouteProp = RouteProp<StackParamList, 'Planning'>;
export type UserProfileRouteProp = RouteProp<StackParamList, 'UserProfile'>;
