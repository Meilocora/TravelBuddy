import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement, useCallback, useContext, useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';

import { Icons, JourneyBottomTabsParamsList, MapLocation } from '../../models';
import IconButton from '../../components/UI/IconButton';
import MapsMarker from '../../components/Maps/MapsMarker';
import MapTypeSelector from '../../components/Maps/MapTypeSelector';
import { JourneyContext } from '../../store/journey-context';
import { fetchJourneysLocations, Location } from '../../utils/http';
import ErrorOverlay from '../../components/UI/ErrorOverlay';
import { getRegionForLocations } from '../../utils/location';
import { generateRandomString } from '../../utils';
import { getCurrentPositionAsync } from 'expo-location';

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
  const journeyCtx = useContext(JourneyContext);
  const journeyId = journeyCtx.selectedJourneyId!;

  useFocusEffect(
    useCallback(() => {
      // Fetch data when the screen comes into focus
      async function getLocations() {
        const response = await fetchJourneysLocations(journeyId);
        if (!response.error && response.locations) {
          setLocations(response.locations!);
          setShownLocations(response.locations!);
          setMapScopeList((prevValues) => [
            ...prevValues,
            ...response.majorStageNames!,
          ]);
          const relevantLocations = response.locations.filter(
            (location) =>
              location.locationType !== 'transportation_departure' &&
              location.locationType !== 'transportation_arrival'
          );
          setRegion(getRegionForLocations(relevantLocations));
        } else if (response.error) {
          setError(response.error);
        } else {
          // TODO: Try again => see location.ts and LocationPicker.tsx
          // const currentRegion = await getCurrentPosition();
          // setRegion({
          //   latitude: currentRegion?.latitude || 0,
          //   longitude: currentRegion?.longitude || 0,
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421,
          // });
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

  function handleChangeMapType(mapType: string) {
    setMapScope(mapType);

    if (mapType !== 'Journey') {
      const filteredLocations = locations.filter(
        (location) => location.belonging === mapType
      );
      const relevantLocations = filteredLocations.filter(
        (location) =>
          location.locationType !== 'transportation_departure' &&
          location.locationType !== 'transportation_arrival'
      );
      setShownLocations(filteredLocations);
      return setRegion(getRegionForLocations(relevantLocations));
    } else {
      const relevantLocations = locations.filter(
        (location) =>
          location.locationType !== 'transportation_departure' &&
          location.locationType !== 'transportation_arrival'
      );
      setShownLocations(locations); // Show all locations for 'Journey'
      return setRegion(getRegionForLocations(relevantLocations));
    }
  }

  // TODO: User should be able to select and unselect MajorStages
  // TODO: Make dynamic ColroScheme for different MinorStages / MajorStages depending on mapScope
  // TODO: Add list of places for the user to jump to
  // TODO: Make component, that draws a <Polyline /> or <MapViewDirections /> between locations

  return (
    <View style={styles.root}>
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
      <MapView
        style={styles.map}
        initialRegion={region!}
        region={region!}
        onPress={() => {}}
      >
        {shownLocations.map((location) => {
          const locationData = location.data;
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
});

export default Map;
