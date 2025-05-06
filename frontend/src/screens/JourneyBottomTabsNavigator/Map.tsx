import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement, useCallback, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import MapView, { Region } from 'react-native-maps';

import { JourneyBottomTabsParamsList } from '../../models';
import MapsMarker from '../../components/Maps/MapsMarker';
import MapTypeSelector from '../../components/Maps/MapTypeSelector';
import { JourneyContext } from '../../store/journey-context';
import { fetchJourneysLocations, Location } from '../../utils/http';
import ErrorOverlay from '../../components/UI/ErrorOverlay';
import { addColor, getRegionForLocations } from '../../utils/location';
import { generateRandomString } from '../../utils';
import MapLocationList from '../../components/Maps/MapLocationList';

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

  async function handleChangeMapType(mapType: string) {
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
      <MapLocationList locations={shownLocations} />
      <MapView
        style={styles.map}
        initialRegion={region!}
        region={region!}
        onPress={() => {}}
        showsUserLocation
        showsMyLocationButton
      >
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
