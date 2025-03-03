import React from 'react';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import MainGradient from './src/components/UI/LinearGradients/MainGradient';

import AllJourneys from './src/screens/AllJourneys';
import UserProfile from './src/screens/UserProfile';
import { GlobalStyles } from './src/constants/styles';
import IconButton from './src/components/UI/IconButton';
import {
  BottomTabsParamList,
  Icons,
  JourneyBottomTabsParamsList,
  StackParamList,
  ManageJourneyRouteProp,
  AuthStackParamList,
  MajorStageStackParamList,
} from './src/models';
import ManageJourney from './src/screens/ManageJourney';
import Locations from './src/screens/Locations';
import Planning from './src/screens/Journey/Planning';
import JourneyContextProvider from './src/store/journey-context';
import MajorStageContextProvider from './src/store/majorStage-context.';
import Overview from './src/screens/Journey/Overview';
import Map from './src/screens/Journey/Map';
import AuthContextProvider, { AuthContext } from './src/store/auth-context';
import { useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from './src/screens/AuthScreen';
import CustomCountryContextProvider from './src/store/custom-country-context';
import ManageCustomCountry from './src/screens/ManageCustomCountry';
import ManagePlaceToVisit from './src/screens/ManagePlaceToVisit';
import MinorStageContextProvider from './src/store/minorStage-context';
import PlaceContextProvider from './src/store/place-context';
import ManageMajorStage from './src/screens/ManageMajorStage';
import SecondaryGradient from './src/components/UI/LinearGradients/SecondaryGradient';
import ManageTransportation from './src/screens/ManageTransportation';
import ManageMinorStage from './src/screens/ManageMinorStage';

// TODO: Implement frontend validation to Forms for max and min length of an entry
// TODO: When not authenticated while being logged in, the user should receive a new authCode immediately

const Stack = createNativeStackNavigator<StackParamList>();
const Auth = createNativeStackNavigator<AuthStackParamList>();
const BottomTabs = createBottomTabNavigator<BottomTabsParamList>();
const JourneyBottomTabs =
  createBottomTabNavigator<JourneyBottomTabsParamsList>();
const MajorStageStack = createNativeStackNavigator<MajorStageStackParamList>();

const navTheme = DefaultTheme;
navTheme.colors.background = 'transparent';

const AuthStack = () => {
  return (
    <>
      <MainGradient />
      <Auth.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Auth.Screen name='AuthScreen' component={AuthScreen} />
      </Auth.Navigator>
    </>
  );
};

const BottomTabsNavigator = () => {
  return (
    <>
      <MainGradient />
      <BottomTabs.Navigator
        screenOptions={({
          navigation,
        }: {
          navigation: BottomTabNavigationProp<BottomTabsParamList>;
        }) => ({
          headerTintColor: 'white',
          headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
          headerTitleAlign: 'center',
          tabBarStyle: {
            backgroundColor: GlobalStyles.colors.primary500,
            borderTopWidth: 1,
            borderTopColor: GlobalStyles.colors.accent600,
            height: 55,
            paddingTop: 5,
          },
          tabBarActiveTintColor: GlobalStyles.colors.accent600,
          tabBarIconStyle: { color: 'white' },
          tabBarLabelStyle: {
            fontSize: 14,
            marginBottom: 5,
          },
          headerRight: ({ tintColor }) => (
            <IconButton
              color={tintColor}
              size={24}
              icon={Icons.person}
              onPress={() => {
                navigation.navigate('UserProfile');
              }}
            />
          ),
        })}
      >
        <BottomTabs.Screen
          name='AllJourneys'
          component={AllJourneys}
          options={{
            title: 'All Journeys',
            tabBarLabel: 'Journeys',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={Icons.listCircle} size={size} color={color} />
            ),
          }}
        />
        <BottomTabs.Screen
          name='ManageJourney'
          component={ManageJourney}
          options={({ route }: { route: ManageJourneyRouteProp }) => ({
            title: !!route.params?.journeyId ? 'Edit Journey' : 'Add Journey',
            tabBarLabel: !!route.params?.journeyId ? 'Edit' : 'Add',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name={!!route.params?.journeyId ? Icons.edit : Icons.add}
                size={size}
                color={color}
              />
            ),
            unmountOnBlur: true,
            presentation: 'modal',
            animation: 'fade',
          })}
        />
        <BottomTabs.Screen
          name='Locations'
          component={Locations}
          options={{
            tabBarLabel: 'Locations',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={Icons.pin} size={size} color={color} />
            ),
          }}
        />
      </BottomTabs.Navigator>
    </>
  );
};

const JourneyBottomTabsNavigator = () => {
  return (
    <>
      <SecondaryGradient />
      <JourneyBottomTabs.Navigator
        screenOptions={({
          navigation,
        }: {
          navigation: NativeStackNavigationProp<BottomTabsParamList>;
        }) => ({
          headerTintColor: 'white',
          headerStyle: { backgroundColor: GlobalStyles.colors.accent700 },
          headerTitleAlign: 'center',
          headerLeft: ({ tintColor }) => (
            <IconButton
              color={tintColor}
              size={24}
              icon={Icons.arrowBack}
              onPress={() => {
                navigation.navigate('AllJourneys');
              }}
            />
          ),
          tabBarStyle: {
            backgroundColor: GlobalStyles.colors.accent700,
            borderTopWidth: 1,
            borderTopColor: 'white',
            height: 55,
            paddingTop: 5,
          },
          tabBarInactiveTintColor: GlobalStyles.colors.gray200,
          tabBarActiveTintColor: 'white',
          tabBarIconStyle: { color: 'white' },
          tabBarLabelStyle: {
            fontSize: 14,
            marginBottom: 5,
          },
        })}
      >
        <JourneyBottomTabs.Screen
          name='Overview'
          component={Overview}
          options={{
            tabBarLabel: 'Overview',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={Icons.readerOutline} size={size} color={color} />
            ),
          }}
        />
        <JourneyBottomTabs.Screen
          name='Planning'
          component={Planning}
          options={{
            tabBarLabel: 'Planning',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name={Icons.calendarOutline}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <JourneyBottomTabs.Screen
          name='Map'
          component={Map}
          options={{
            tabBarLabel: 'Map',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={Icons.compassOutline} size={size} color={color} />
            ),
          }}
        />
        <JourneyBottomTabs.Screen
          name='MajorStageStackNavigator'
          component={MajorStageStackNavigator}
          options={{
            tabBarButton: () => null,
            headerShown: false,
          }}
        />
      </JourneyBottomTabs.Navigator>
    </>
  );
};

const MajorStageStackNavigator = () => {
  return (
    <MajorStageStack.Navigator
      screenOptions={({
        navigation,
      }: {
        navigation: NativeStackNavigationProp<JourneyBottomTabsParamsList>;
      }) => ({
        headerTintColor: 'white',
        headerStyle: { backgroundColor: GlobalStyles.colors.accent700 },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      })}
    >
      <MajorStageStack.Screen
        name='ManageMajorStage'
        component={ManageMajorStage}
      />
      <MajorStageStack.Screen
        name='ManageMinorStage'
        component={ManageMinorStage}
      />
      <MajorStageStack.Screen
        name='ManageTransportation'
        component={ManageTransportation}
      />
    </MajorStageStack.Navigator>
  );
};

// All Screens, that require Authentication, are wrapped in AuthenticatedStack
const AuthenticatedStack = () => {
  const authCtx = useContext(AuthContext);

  return (
    <JourneyContextProvider>
      <CustomCountryContextProvider>
        <PlaceContextProvider>
          <MajorStageContextProvider>
            <MinorStageContextProvider>
              <Stack.Navigator
                screenOptions={() => ({
                  headerTintColor: 'white',
                  headerStyle: {
                    backgroundColor: GlobalStyles.colors.primary500,
                  },
                  headerTitleAlign: 'center',
                  headerShadowVisible: false,
                })}
              >
                <Stack.Screen
                  name='BottomTabsNavigator'
                  component={BottomTabsNavigator}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='UserProfile'
                  component={UserProfile}
                  options={{
                    title: `${authCtx.username}'s Profile`,
                    headerRight: ({ tintColor }) => (
                      <IconButton
                        color={tintColor}
                        size={24}
                        icon={Icons.logout}
                        onPress={() => {
                          authCtx.logout();
                        }}
                      />
                    ),
                  }}
                />
                <Stack.Screen
                  name='JourneyBottomTabsNavigator'
                  component={JourneyBottomTabsNavigator}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='ManageCustomCountry'
                  component={ManageCustomCountry}
                />
                <Stack.Screen
                  name='ManagePlaceToVisit'
                  component={ManagePlaceToVisit}
                />
              </Stack.Navigator>
            </MinorStageContextProvider>
          </MajorStageContextProvider>
        </PlaceContextProvider>
      </CustomCountryContextProvider>
    </JourneyContextProvider>
  );
};

const Navigation = () => {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer theme={navTheme}>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
};

const Root = () => {
  const authCtx = useContext(AuthContext);

  // Logic for auto login
  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

      if (storedToken) {
        authCtx.authenticate(storedToken, storedRefreshToken || '');
      }
    }

    fetchToken();
  }, [authCtx]);

  return <Navigation />;
};

export default function App() {
  return (
    <>
      <StatusBar style='inverted' />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
