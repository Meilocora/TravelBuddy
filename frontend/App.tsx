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
import { NavigationContainer } from '@react-navigation/native';

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
} from './src/models';
import ManageJourney from './src/screens/ManageJourney';
import Camera from './src/screens/Camera';
import Planning from './src/screens/Journey/Planning';
import JourneyContextProvider from './src/store/journey-context';
import MajorStageContextProvider from './src/store/majorStage-context.';
import Overview from './src/screens/Journey/Overview';
import Map from './src/screens/Journey/Map';
import Favorites from './src/screens/Favorites';

const Stack = createNativeStackNavigator<StackParamList>();
const BottomTabs = createBottomTabNavigator<BottomTabsParamList>();
const JourneyBottomTabs =
  createBottomTabNavigator<JourneyBottomTabsParamsList>();

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
          })}
        />
        <BottomTabs.Screen
          name='Favorites'
          component={Favorites}
          options={{
            tabBarLabel: 'Favorites',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={Icons.heartOutline} size={size} color={color} />
            ),
          }}
        />
        {/* <BottomTabs.Screen
          name='Camera'
          component={Camera}
          options={{
            tabBarLabel: 'Camera',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={Icons.cameraOutline} size={size} color={color} />
            ),
          }}
        /> */}
      </BottomTabs.Navigator>
    </JourneyContextProvider>
  );
};

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

export default function App() {
  return (
    <>
      <StatusBar style='inverted' />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={() => ({
            headerTintColor: 'white',
            headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
            headerTitleAlign: 'center',
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
              title: 'User Profile',
            }}
          />
          <Stack.Screen
            name='JourneyBottomTabsNavigator'
            component={JourneyBottomTabsNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
