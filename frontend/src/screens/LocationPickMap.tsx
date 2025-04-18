import 'react-native-get-random-values';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';

import { StackParamList } from '../models';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '@env';
import Modal from '../components/UI/Modal';

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

  const [hasLocation, setHasLocation] = useState(route.params.hasLocation);
  const [region, setRegion] = useState<Region>({
    latitude: initialLocation.lat,
    longitude: initialLocation.lng,
    latitudeDelta: 0.1,
    longitudeDelta: 0.04,
  });
  const [showModal, setShowModal] = useState(false);

  function selectLocationHandler(event: MapPressEvent) {
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.1,
      longitudeDelta: 0.04,
    });
    setHasLocation(true);
    setShowModal(true);
  }

  function handleSearchResult(data: any, details: any) {
    if (details) {
      const { lat, lng } = details.geometry.location;
      setRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.04,
      });
      setHasLocation(true);
      setShowModal(true);
    }
    return;
  }

  function handleSelectPlace() {
    route.params.onPickLocation({
      lat: region.latitude,
      lng: region.longitude,
    });
    navigation.goBack();
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Pick a Location',
    });
  }, []);

  return (
    <View style={styles.container}>
      {showModal && (
        <Modal
          content='Do you want to add this place?'
          title='Add Place'
          confirmText='Confirm'
          onCancel={() => setShowModal(false)}
          onConfirm={handleSelectPlace}
          positiveConfirm
        />
      )}
      <GooglePlacesAutocomplete
        placeholder='Search for a location'
        fetchDetails={true}
        onPress={handleSearchResult}
        query={{
          key: GOOGLE_API_KEY,
          language: 'en',
        }}
        styles={{
          container: styles.searchContainer,
          textInput: styles.searchInput,
        }}
      />
      <MapView
        initialRegion={region!}
        region={region}
        onPress={selectLocationHandler}
        style={styles.map}
      >
        {initialLocation && hasLocation && (
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
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
