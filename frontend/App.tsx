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
import { LinearGradient } from 'expo-linear-gradient';

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
} from './src/models';
import ManageJourney from './src/screens/ManageJourney';
import Locations from './src/screens/Locations';
import Planning from './src/screens/Journey/Planning';
import JourneyContextProvider from './src/store/journey-context';
import MajorStageContextProvider from './src/store/majorStage-context.';
import Overview from './src/screens/Journey/Overview';
import Map from './src/screens/Journey/Map';
import AuthContextProvider, { AuthContext } from './src/store/auth-context';
import { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from './src/screens/AuthScreen';
import CustomCountryContextProvider from './src/store/custom-country-context';
import ManageCustomCountry from './src/screens/ManageCustomCountry';

const Stack = createNativeStackNavigator<StackParamList>();
const Auth = createNativeStackNavigator<AuthStackParamList>();
const BottomTabs = createBottomTabNavigator<BottomTabsParamList>();
const JourneyBottomTabs =
  createBottomTabNavigator<JourneyBottomTabsParamsList>();

const navTheme = DefaultTheme;
navTheme.colors.background = 'transparent';

// TODOS:
// 1. Add Login and Registration Screens - DONE
// 2. Add Authentication Context - DONE
// 3. Add AuthStack and AuthenticatedStack - DONE
// 4. Add Backend Authentication - DONE
// 5. Add Backend for country Information - DONE
// 6. Add Creating a country by choosing from dropdown, and the filling out form - DONE
// 7. Add Creating PlacesToVisit for the CustomCountry
// 8. Adjust http requests for Journey, MajorStage and MinorStage

const AuthStack = () => {
  return (
    <Auth.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Auth.Screen name='AuthScreen' component={AuthScreen} />
    </Auth.Navigator>
  );
};

const BottomTabsNavigator = () => {
  return (
    <JourneyContextProvider>
      <BottomTabs.Navigator
        screenOptions={({
          navigation,
        }: {
          navigation: BottomTabNavigationProp<BottomTabsParamList>;
        }) => ({
          headerTintColor: 'white',
          headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
          tabBarActiveTintColor: GlobalStyles.colors.accent600,
          tabBarIconStyle: { color: 'white' },
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
    </JourneyContextProvider>
  );
};

// TODO: Rework position for ContextProviders

const JourneyBottomTabsNavigator = () => {
  return (
    <MajorStageContextProvider>
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
          tabBarStyle: { backgroundColor: GlobalStyles.colors.accent700 },
          tabBarInactiveTintColor: GlobalStyles.colors.gray200,
          tabBarActiveTintColor: 'white',
          tabBarIconStyle: { color: 'white' },
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
      </JourneyBottomTabs.Navigator>
    </MajorStageContextProvider>
  );
};

// All Screens, that require Authentication, are wrapped in AuthenticatedStack
const AuthenticatedStack = () => {
  const authCtx = useContext(AuthContext);

  return (
    <CustomCountryContextProvider>
      <Stack.Navigator
        screenOptions={() => ({
          headerTintColor: 'white',
          headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
          headerTitleAlign: 'center',
        })}
      >
        <>
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
        </>
      </Stack.Navigator>
    </CustomCountryContextProvider>
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
  // const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  // Logic for auto login
  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

      if (storedToken) {
        authCtx.authenticate(storedToken, storedRefreshToken || '');
      }

      // setIsTryingLogin(false);
    }

    fetchToken();
  }, [authCtx]);

  return <Navigation />;
};

export default function App() {
  return (
    <>
      <LinearGradient
        style={{
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        colors={['#042f01', '#02461a', '#006f21']}
        locations={[0.1, 0.85, 1]}
      />
      <StatusBar style='inverted' />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
