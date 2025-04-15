import 'react-native-get-random-values';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';

import { StackParamList } from '../models';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '@env';

interface LocationPickMapProps {
  navigation: NativeStackNavigationProp<StackParamList, 'LocationPickMap'>;
  route: RouteProp<StackParamList, 'LocationPickMap'>;
}

const LocationPickMap: React.FC<LocationPickMapProps> = ({
  navigation,
  route,
}): ReactElement => {
  const initialLocation = route.params && {
    lat: route.params.initialLat,
    lng: route.params.initialLng,
  };

  const region: Region = {
    latitude: initialLocation.lat,
    longitude: initialLocation.lng,
    latitudeDelta: 0.1,
    longitudeDelta: 0.04,
  };

  function selectLocationHandler(event: MapPressEvent) {
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    route.params.onPickLocation({ lat: lat, lng: lng });
    navigation.goBack();
  }

  function handleSearchResult(data: any, details: any) {
    console.log(data, details);

    // MapView should switch to location so the user can tap

    if (details) {
      // const { lat, lng } = details.geometry.location;
      console.log(details);
      // route.params.onPickLocation({ lat, lng });
      // navigation.goBack();
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Pick a Location',
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* <GooglePlacesAutocomplete
        placeholder='Search for a location'
        fetchDetails={true}
        onPress={handleSearchResult}
        query={{
          key: GOOGLE_API_KEY,
          // TODO: API_KEY wont work, make new project with new key
          language: 'en',
        }}
        styles={{
          container: styles.searchContainer,
          textInput: styles.searchInput,
        }}
      /> */}
      <MapView
        initialRegion={region!}
        onPress={selectLocationHandler}
        style={styles.map}
      >
        {initialLocation && route.params.hasInitialLocation && (
          <Marker
            coordinate={{
              latitude: initialLocation.lat,
              longitude: initialLocation.lng,
            }}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    width: '90%',
    alignSelf: 'center',
    zIndex: 1,
  },
  searchInput: {
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  map: {
    flex: 1,
  },
});

export default LocationPickMap;
