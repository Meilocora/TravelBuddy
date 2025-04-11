import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';

export type BottomTabsParamList = {
  AllJourneys: undefined | { popupText?: string };
  ManageJourney: { journeyId?: number };
  Locations: undefined | { popupText?: string };
  UserProfile: undefined;
};

export type MajorStageStackParamList = {
  ManageMajorStage: { majorStageId?: number; journeyId: number };
  ManageMinorStage: {
    journeyId: number;
    majorStageId: number;
    minorStageId?: number;
  };
  ManageTransportation: {
    journeyId?: number;
    majorStageId?: number;
    minorStageId?: number;
    transportationId?: number;
  };
  MinorStages: {
    journeyId: number;
    majorStageId: number;
    popupText?: string;
  };
  ManageActivity: {
    majorStageId: number;
    minorStageId: number;
    activityId?: number;
  };
  ManageSpending: {
    majorStageId: number;
    minorStageId: number;
    spendingId?: number;
  };
};

export type JourneyBottomTabsParamsList = {
  Planning: { journeyId: number; popupText?: string };
  Overview: undefined;
  Map: undefined;
  MajorStageStackNavigator: NavigatorScreenParams<MajorStageStackParamList>;
};

export type StackParamList = {
  AuthStackNavigator: NavigatorScreenParams<AuthStackParamList>;
  BottomTabsNavigator: NavigatorScreenParams<BottomTabsParamList>;
  UserProfile: undefined;
  JourneyBottomTabsNavigator: NavigatorScreenParams<JourneyBottomTabsParamsList>;
  ManageCustomCountry: { countryId: number };
  ManagePlaceToVisit: { placeId: number | null; countryId: number | null };
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

export type ManagePlaceToVisitRouteProp = RouteProp<
  StackParamList,
  'ManagePlaceToVisit'
>;
