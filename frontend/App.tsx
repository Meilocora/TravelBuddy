import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import AllJourneys from './src/screens/AllJourneys';
import UserProfile from './src/screens/UserProfile';
import { NavigationContainer } from '@react-navigation/native';
import { GlobalStyles } from './src/constants/styles';
import IconButton from './src/components/UI/IconButton';
import { BottomTabsParamList, Icons, StackParamList } from './src/models';
import AddJourney from './src/screens/AddJourney';
import Camera from './src/screens/Camera';
import Planning from './src/screens/Journey/Planning';

const Stack = createNativeStackNavigator<StackParamList>();
const BottomTabs = createBottomTabNavigator<BottomTabsParamList>();

const BottomTabsNavigator = () => {
  return (
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
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
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
        name='AddJourney'
        component={AddJourney}
        options={{
          title: 'Add Journeys',
          tabBarLabel: 'Add',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={Icons.add} size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name='Camera'
        component={Camera}
        options={{
          tabBarLabel: 'Camera',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={Icons.cameraOutline} size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
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
          <Stack.Screen name='Planning' component={Planning} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
