import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement, useCallback, useLayoutEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { Icons, JourneyBottomTabsParamsList } from '../../models';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import IconButton from '../../components/UI/IconButton';
import MapsMarker from '../../components/Maps/MapsMarker';

interface MapProps {
  navigation: NativeStackNavigationProp<JourneyBottomTabsParamsList, 'Map'>;
  route: RouteProp<JourneyBottomTabsParamsList, 'Map'>;
}

const Map: React.FC<MapProps> = ({ navigation, route }): ReactElement => {
  const initialLocation = route.params && {
    lat: route.params.initialLat,
    lng: route.params.initialLng,
  };

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number | undefined;
    lng: number | undefined;
  }>(initialLocation);

  const region: Region = {
    latitude: initialLocation ? initialLocation.lat! : 48.1483601,
    longitude: initialLocation ? initialLocation.lng! : 11.5400113,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event: MapPressEvent) {
    if (initialLocation) {
      return;
    }
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat: lat, lng: lng });
  }

  // prevents unnecessary rerender cycles for the function
  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        'No location picked!',
        'You have to pick a location by tapping on the map first!'
      );
      return;
    }

    // navigation.navigate("AddPlace", {
    //   pickedLat: selectedLocation.lat,
    //   pickedLng: selectedLocation.lng,
    // });
  }, [navigation, selectedLocation]);

  useLayoutEffect(() => {
    if (initialLocation) {
      return;
    }
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon={Icons.save}
          size={24}
          color={tintColor}
          onPress={savePickedLocationHandler}
        />
      ),
    });
  }, [navigation, savePickedLocationHandler, initialLocation]);

  const exampleLink =
    'https://www.google.de/maps/place/Hotelpension+Moosh%C3%A4usl+Hebertshausen/@48.2666063,11.536995,10218m/data=!3m1!1e3!4m9!3m8!1s0x479e7072bd99d29f:0x9c5bb998119890bb!5m2!4m1!1i2!8m2!3d48.2808216!4d11.5141239!16s%2Fg%2F1thw5qgk?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D';

  const exampleLink2 =
    'https://www.google.de/maps/place/Gewerbegebiet+Bajuwarenstra%C3%9Fe,+85757+Karlsfeld/@48.2220299,11.4567484,7662m/data=!3m1!1e3!4m6!3m5!1s0x479e70ab3761317b:0x120ab19707652831!8m2!3d48.2257516!4d11.4843832!16s%2Fg%2F11b8tdrfk_?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D';
  // TODO: Let User choose a majorStage and minorStages in different colors with from the map, also
  // TODO: Make component, that draws a <Polyline /> or <MapViewDirections /> between locations

  return (
    <>
      <Text>Selection for MajorStage</Text>
      <MapView
        style={styles.root}
        initialRegion={region!}
        onPress={selectLocationHandler}
      >
        <MapsMarker mapsLink={exampleLink} />
        <MapsMarker mapsLink={exampleLink2} />
      </MapView>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default Map;
