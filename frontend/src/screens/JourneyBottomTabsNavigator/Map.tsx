import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement, useCallback, useLayoutEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { Icons, JourneyBottomTabsParamsList, MapLocation } from '../../models';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import IconButton from '../../components/UI/IconButton';
import MapsMarker from '../../components/Maps/MapsMarker';
import MapTypeSelector from '../../components/Maps/MapTypeSelector';

interface MapProps {
  navigation: NativeStackNavigationProp<JourneyBottomTabsParamsList, 'Map'>;
  route: RouteProp<JourneyBottomTabsParamsList, 'Map'>;
}

const Map: React.FC<MapProps> = ({ navigation, route }): ReactElement => {
  const [mapType, setMapType] = useState<string>('standard');
  // const initialLocation = route.params && {
  //   lat: route.params.initialLat,
  //   lng: route.params.initialLng,
  // };

  // const [selectedLocation, setSelectedLocation] =
  //   useState<MapLocation>(initialLocation);

  const region: Region = {
    // latitude: initialLocation ? initialLocation.lat! : 48.1483601,
    // longitude: initialLocation ? initialLocation.lng! : 11.5400113,
    latitude: 48.1483601,
    longitude: 11.5400113,
    latitudeDelta: 0.1,
    longitudeDelta: 0.04,
  };

  // TODO: Mode: Journey or MajorStage-View
  // Journey => show MajorStages Data incl. MinorStages in colors
  // MajorStage => show MajorStage and MinorStages in colors
  // TODO: User should be able to select and unselect MajorStages

  // TODO: Let User choose a majorStage and minorStages in different colors with from the map, also different icons for transport, places, actitivites, accommodation, etc.
  // TODO: Make component, that draws a <Polyline /> or <MapViewDirections /> between locations

  return (
    <View style={styles.root}>
      <MapTypeSelector
        onChangeMapType={setMapType.bind(this, 'type')}
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
