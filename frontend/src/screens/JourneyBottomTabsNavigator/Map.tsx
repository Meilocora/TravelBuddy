import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';

import { Icons, JourneyBottomTabsParamsList, MapLocation } from '../../models';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import IconButton from '../../components/UI/IconButton';
import MapsMarker from '../../components/Maps/MapsMarker';
import MapTypeSelector from '../../components/Maps/MapTypeSelector';
import { JourneyContext } from '../../store/journey-context';
import { fetchJourneysLocations, Location } from '../../utils/http';
import ErrorOverlay from '../../components/UI/ErrorOverlay';
import { getRegionForLocations } from '../../utils/location';
import { map } from 'zod';
import { generateRandomString } from '../../utils';

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
        if (!response.error) {
          setLocations(response.locations!);
          setShownLocations(response.locations!);
          setMapScopeList((prevValues) => [
            ...prevValues,
            ...response.majorStageNames!,
          ]);
        } else {
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

  function handleChangeMapType(mapType: string) {
    setMapScope(mapType);
    if (mapType !== 'Journey') {
      const filteredLocations = locations.filter(
        (location) => location.belonging === mapType
      );
      setShownLocations(filteredLocations);
      setRegion(getRegionForLocations(filteredLocations));
    } else {
      setShownLocations(locations); // Show all locations for 'Journey'
      setRegion(getRegionForLocations(locations));
    }
  }

  // locationType = ['accommodation', 'activity', 'transportation_departure', 'transportation_arrival', 'place'] <== find symbols for each of them
  // TODO: User should be able to select and unselect MajorStages
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
            <MapsMarker
              key={generateRandomString()}
              lat={locationData.latitude}
              lng={locationData.longitude}
              name={locationData.name}
            />
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
