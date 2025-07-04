import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import MapView, { LatLng, Region } from 'react-native-maps';
import MapViewDirections, {
  MapViewDirectionsMode,
} from 'react-native-maps-directions';

import {
  ColorScheme,
  JourneyBottomTabsParamsList,
  Location,
} from '../../models';
import MapsMarker from '../../components/Maps/MapsMarker';
import MapTypeSelector from '../../components/Maps/MapTypeSelector';
import {
  addColor,
  getCurrentLocation,
  getMapLocationsFromJourney,
  getRegionForLocations,
} from '../../utils/location';
import MapLocationList from '../../components/Maps/MapLocationList';
import { GOOGLE_API_KEY } from '@env';
import Popup from '../../components/UI/Popup';
import { StagesContext } from '../../store/stages-context';
import MapLocationElement from '../../components/Maps/MapLocationElement/MapLocationElement';
import RoutePlanner from '../../components/Maps/RoutePlanner';

interface MapProps {
  navigation: NativeStackNavigationProp<JourneyBottomTabsParamsList, 'Map'>;
  route: RouteProp<JourneyBottomTabsParamsList, 'Map'>;
}

const Map: React.FC<MapProps> = ({ navigation, route }): ReactElement => {
  const [mapScope, setMapScope] = useState<string>('Journey');
  const [mapScopeList, setMapScopeList] = useState<string[]>(['Journey']);
  const [locations, setLocations] = useState<Location[]>([]);
  const [shownLocations, setShownLocations] = useState<Location[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const [directionDestination, setDirectionDestination] =
    useState<LatLng | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
  } | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [directionsMode, setDirectionsMode] =
    useState<MapViewDirectionsMode>('DRIVING');
  const [popupText, setPopupText] = useState<string | undefined>();
  const [pressedLocation, setPressedLocation] = useState<
    Location | undefined
  >();
  const [routePoints, setRoutePoints] = useState<LatLng[] | undefined>();

  const [showContent, setShowContent] = useState([
    { button: true, list: false },
    { button: true, list: false },
  ]);

  const stagesCtx = useContext(StagesContext);
  const journeyId = stagesCtx.selectedJourneyId!;
  const journey = stagesCtx.findJourney(journeyId);

  let majorStageTitles: string[] = [];
  let minorStageTitles: string[] = [];

  if (journey?.majorStages) {
    for (const majorStage of journey.majorStages) {
      majorStageTitles.push(majorStage.title);
      if (!majorStage.minorStages) {
        continue;
      }
      for (const minorStage of majorStage.minorStages) {
        minorStageTitles.push(minorStage.title);
      }
    }
  }

  // const majorStageTitles: string[] = journey?.majorStages
  //   ? journey.majorStages.map((stage) => stage.title)
  //   : [];

  useEffect(() => {
    async function fetchUserLocation() {
      const currentLocation = await getCurrentLocation();
      setUserLocation(currentLocation);
    }

    fetchUserLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // get data when the screen comes into focus
      async function getLocations() {
        const locations = getMapLocationsFromJourney(journey!);
        if (locations) {
          setLocations(locations);
          const coloredLocations = addColor(locations, mapScope);
          setShownLocations(coloredLocations);
          setMapScopeList((prevValues) => [...prevValues, ...majorStageTitles]);
          const relevantLocations = locations.filter(
            (location) =>
              location.locationType !== 'transportation_departure' &&
              location.locationType !== 'transportation_arrival'
          );
          setRegion(await getRegionForLocations(relevantLocations));
        }
      }

      getLocations();

      return () => {
        // Cleanup function to reset all states when the screen goes out of focus
        setLocations([]);
        setMapScopeList(['Journey']); // Reset the list on cleanup
        setMapScope('Journey'); // Reset the map scope to default
        setPressedLocation(undefined);
      };
    }, [journeyId])
  );

  function handlePressListElement(location: Location) {
    setRegion({
      latitude: location.data.latitude,
      longitude: location.data.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.04,
    });
    setDirectionDestination({
      latitude: location.data.latitude,
      longitude: location.data.longitude,
    });
    setPressedLocation(location);
  }

  function handleChangeDirectionsMode(mode: MapViewDirectionsMode) {
    setDirectionsMode(mode);
  }

  function handleClosePopup() {
    setPopupText(undefined);
  }

  function handleCloseMapLocationElement() {
    setPressedLocation(undefined);
  }

  async function handleChangeMapType(mapType: string) {
    setMapScope(mapType);
    setDirectionDestination(null);
    setPressedLocation(undefined);
    setRoutePoints(undefined);
    setRouteInfo(null);

    if (mapType !== 'Journey') {
      const filteredLocations = locations.filter(
        (location) => location.belonging === mapType
      );
      const relevantLocations = filteredLocations.filter(
        (location) =>
          location.locationType !== 'transportation_departure' &&
          location.locationType !== 'transportation_arrival'
      );
      const coloredLocations = addColor(filteredLocations, mapType);
      setShownLocations(coloredLocations);

      return setRegion(await getRegionForLocations(relevantLocations));
    } else {
      const relevantLocations = locations.filter(
        (location) =>
          location.locationType !== 'transportation_departure' &&
          location.locationType !== 'transportation_arrival'
      );
      const coloredLocations = addColor(locations, mapType);
      setShownLocations(coloredLocations); // Show all locations for 'Journey'

      return setRegion(await getRegionForLocations(relevantLocations));
    }
  }

  // TODO: Let user also choose a single MinorStage, if he wants (additional selection further right)

  function handleHideButtons(identifier: 'locationList' | 'routePlanner') {
    if (identifier === 'locationList') {
      if (showContent[0].button === false) {
        setShowContent([
          { button: true, list: false },
          { button: true, list: false },
        ]);
      } else {
        setShowContent([
          { button: false, list: true },
          { button: false, list: false },
        ]);
        setRoutePoints(undefined);
        setRouteInfo(null);
      }
    } else if (identifier === 'routePlanner') {
      if (showContent[1].button === false) {
        setShowContent([
          { button: true, list: false },
          { button: true, list: false },
        ]);
      } else {
        setShowContent([
          { button: false, list: false },
          { button: false, list: true },
        ]);
        setDirectionDestination(null);
        setRouteInfo(null);
      }
    }
  }

  return (
    <View style={styles.root}>
      {popupText && (
        <Popup
          content={popupText}
          onClose={handleClosePopup}
          colorScheme={ColorScheme.accent}
        />
      )}
      <MapTypeSelector
        onChangeMapType={handleChangeMapType}
        value={mapScope}
        mapScopeList={mapScopeList}
      />
      <MapLocationList
        locations={shownLocations}
        mapScope={mapScope}
        mode={directionsMode}
        setMode={handleChangeDirectionsMode}
        onPress={handlePressListElement}
        toggleButtonVisibility={() => handleHideButtons('locationList')}
        showContent={showContent[0]}
      />
      <RoutePlanner
        locations={shownLocations}
        mapScope={mapScope}
        mode={directionsMode}
        setMode={handleChangeDirectionsMode}
        toggleButtonVisibility={() => handleHideButtons('routePlanner')}
        showContent={showContent[1]}
        setRoutePoints={setRoutePoints}
      />
      <MapView
        style={styles.map}
        initialRegion={region!}
        region={region!}
        onPress={() => {}}
        showsUserLocation
        showsMyLocationButton
      >
        {directionDestination && userLocation && (
          <MapViewDirections
            apikey={GOOGLE_API_KEY}
            origin={userLocation}
            destination={directionDestination}
            strokeWidth={4}
            strokeColor='blue'
            precision='high'
            mode={directionsMode}
            onError={() => setPopupText('No route found...')}
            onReady={(result) => {
              setRouteInfo({
                distance: result.distance, // in kilometers
                duration: result.duration, // in minutes
              });
            }}
          />
        )}
        {routePoints && routePoints.length > 1 && (
          <MapViewDirections
            apikey={GOOGLE_API_KEY}
            origin={routePoints[0]}
            destination={routePoints[routePoints.length - 1]}
            waypoints={
              routePoints.length > 2 ? routePoints.slice(1, -1) : undefined
            }
            strokeWidth={4}
            strokeColor='blue'
            precision='high'
            mode={directionsMode}
            onError={() => setPopupText('No route found...')}
            onReady={(result) => {
              setRouteInfo({
                distance: result.distance, // in kilometers
                duration: result.duration, // in minutes
              });
            }}
          />
        )}
        {shownLocations.map((location) => {
          const isActive = pressedLocation && location === pressedLocation;
          return (
            <MapsMarker
              key={location.data.latitude + ',' + location.data.longitude}
              location={location}
              active={isActive}
            />
          );
        })}
      </MapView>
      {pressedLocation && (
        <MapLocationElement
          location={pressedLocation}
          onClose={handleCloseMapLocationElement}
        />
      )}
      {routeInfo && (
        <Pressable
          onPress={() => setRouteInfo(null)}
          style={styles.routeInfoContainer}
        >
          <Text style={styles.routeInfoText}>
            Distance: {routeInfo.distance.toFixed(1)} km | Time:{' '}
            {Math.round(routeInfo.duration)} min
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  map: {
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    top: '90%',
    left: '80%',
  },
  routeInfoContainer: {
    position: 'absolute',
    top: 55,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  routeInfoText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Map;
