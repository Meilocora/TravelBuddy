import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ReactElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { Icons, JourneyBottomTabsParamsList, MapLocation } from '../../models';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import IconButton from '../../components/UI/IconButton';
import MapsMarker from '../../components/Maps/MapsMarker';
import MapTypeSelector from '../../components/Maps/MapTypeSelector';
import { JourneyContext } from '../../store/journey-context';

interface MapProps {
  navigation: NativeStackNavigationProp<JourneyBottomTabsParamsList, 'Map'>;
  route: RouteProp<JourneyBottomTabsParamsList, 'Map'>;
}

const Map: React.FC<MapProps> = ({ navigation, route }): ReactElement => {
  const [mapScope, setMapScope] = useState<string>('Journey');
  const journeyCtx = useContext(JourneyContext);
  const journeyId = journeyCtx.selectedJourneyId;

  // TODO:
  // mapScope = ['Journey', 'MajorStage1', 'MajorStage2', ...]
  // TODO: http request to get all locations of the journey
  // [{'locationType': string, 'lat': number, 'lng': number, 'name': string}]
  // locationType = ['accommodation', 'activity', 'transportation_departure', 'transportation_arrival', 'place'] <== find symbols for each of them

  const region: Region = {
    // latitude: initialLocation ? initialLocation.lat! : 48.1483601,
    // longitude: initialLocation ? initialLocation.lng! : 11.5400113,
    latitude: 48.1483601,
    longitude: 11.5400113,
    latitudeDelta: 0.1,
    longitudeDelta: 0.04,
  };

  // TODO: User should be able to select and unselect MajorStages
  // TODO: Make component, that draws a <Polyline /> or <MapViewDirections /> between locations

  return (
    <View style={styles.root}>
      <MapTypeSelector
        onChangeMapType={setMapScope.bind(this, 'type')}
        defaultType='standard'
      />
      <MapView
        style={styles.map}
        initialRegion={region!}
        onPress={() => {}}
      ></MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  map: {
    // marginTop: '10%',
    height: '100%',
  },
});

export default Map;
