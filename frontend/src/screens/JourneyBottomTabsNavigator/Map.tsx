import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import MapView, { LatLng, Region } from 'react-native-maps';
import MapViewDirections, {
  MapViewDirectionsMode,
} from 'react-native-maps-directions';

import { ColorScheme, JourneyBottomTabsParamsList } from '../../models';
import MapsMarker from '../../components/Maps/MapsMarker';
import MapTypeSelector from '../../components/Maps/MapTypeSelector';
import { JourneyContext } from '../../store/journey-context';
import { fetchJourneysLocations, Location } from '../../utils/http';
import ErrorOverlay from '../../components/UI/ErrorOverlay';
import {
  addColor,
  getCurrentLocation,
  getRegionForLocations,
} from '../../utils/location';
import { generateRandomString } from '../../utils';
import MapLocationList from '../../components/Maps/MapLocationList';
import { GOOGLE_API_KEY } from '@env';
import Popup from '../../components/UI/Popup';

interface MapProps {
  navigation: NativeStackNavigationProp<JourneyBottomTabsParamsList, 'Map'>;
  route: RouteProp<JourneyBottomTabsParamsList, 'Map'>;
}

const Map: React.FC<MapProps> = ({ navigation, route }): ReactElement => {
  const [isFetching, setIsFetching] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mapScope, setMapScope] = useState<string>('Journey');
  const [mapScopeList, setMapScopeList] = useState<string[]>(['Journey']);
  const [locations, setLocations] = useState<Location[]>([]);
  const [shownLocations, setShownLocations] = useState<Location[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const [directionDestination, setDirectionDestination] =
    useState<LatLng | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [directionsMode, setDirectionsMode] =
    useState<MapViewDirectionsMode>('WALKING');
  const [popupText, setPopupText] = useState<string | undefined>();

  const journeyCtx = useContext(JourneyContext);
  const journeyId = journeyCtx.selectedJourneyId!;

  useEffect(() => {
    async function fetchUserLocation() {
      const currentLocation = await getCurrentLocation();
      setUserLocation(currentLocation);
    }

    fetchUserLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Fetch data when the screen comes into focus
      async function getLocations() {
        const response = await fetchJourneysLocations(journeyId);
        if (!response.error && response.locations) {
          setLocations(response.locations!);
          const coloredLocations = addColor(response.locations!, mapScope);
          setShownLocations(coloredLocations);
          setMapScopeList((prevValues) => [
            ...prevValues,
            ...response.majorStageNames!,
          ]);
          const relevantLocations = response.locations.filter(
            (location) =>
              location.locationType !== 'transportation_departure' &&
              location.locationType !== 'transportation_arrival'
          );
          setRegion(await getRegionForLocations(relevantLocations));
        } else if (response.error) {
          setError(response.error);
        }
        setIsFetching(false);
      }

      getLocations();

      return () => {
        // Cleanup function to reset all states when the screen goes out of focus
        setIsFetching(false);
        setError(null);
        setLocations([]);
        setMapScopeList(['Journey']); // Reset the list on cleanup
        setMapScope('Journey'); // Reset the map scope to default
      };
    }, [journeyId])
  );

  function handlePressReload() {
    setError(null);
    setRefresh((prev) => prev + 1);
  }

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
  }

  function handleChangeDirectionsMode(mode: MapViewDirectionsMode) {
    setDirectionsMode(mode);
  }

  function handleClosePopup() {
    setPopupText(undefined);
  }

  async function handleChangeMapType(mapType: string) {
    setMapScope(mapType);
    setDirectionDestination(null);

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

  // Add additional component, that lets user edit location and have a look at the component (should be at bottom, sliding up)

  return (
    <View style={styles.root}>
      {popupText && (
        <Popup
          content={popupText}
          onClose={handleClosePopup}
          colorScheme={ColorScheme.accent}
        />
      )}
      {error && (
        <ErrorOverlay
          message={error}
          onPress={handlePressReload}
          buttonText='Reload'
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
            // origin={{ latitude: 21.0277717, longitude: 105.8215235 }}
            destination={directionDestination}
            strokeWidth={4}
            strokeColor='blue'
            precision='high'
            mode={directionsMode}
            onError={() => setPopupText('No route found...')}
          />
        )}
        {shownLocations.map((location) => {
          return (
            <MapsMarker key={generateRandomString()} location={location} />
          );
        })}
      </MapView>
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
});

export default Map;
