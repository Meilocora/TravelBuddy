import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location';
import { StyleSheet, View, Alert } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { ReactElement, useEffect, useState } from 'react';

import { Icons, MapLocation, StackParamList } from '../../../models';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formatMapsLink } from '../../../utils';
import IconButton from '../IconButton';

interface LocationPickerProps {
  pickedLocation?: MapLocation;
  onPickLocation: (mapsLink: string) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  pickedLocation,
  onPickLocation,
}): ReactElement => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const [hasInitialLocation, setHasInitialLocation] = useState(false);
  const isFocused = useIsFocused(); // true, when mainscreen for user

  useEffect(() => {
    if (pickedLocation) {
      setHasInitialLocation(true);
    }
  }, [pickedLocation]);

  const [locationPermissionInfotmation, requestPermission] =
    useForegroundPermissions();

  async function verifyPermissions() {
    if (
      locationPermissionInfotmation!.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (locationPermissionInfotmation!.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant location permissions to use this app.'
      );
      return false;
    }
    return true;
  }

  async function pickOnMapHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    let latitude: number;
    let longitude: number;
    if (!pickedLocation) {
      const location = await getCurrentPositionAsync();
      latitude = location.coords.latitude!;
      longitude = location.coords.longitude!;
    } else {
      latitude = pickedLocation.lat!;
      longitude = pickedLocation.lng!;
    }

    navigation.navigate('LocationPickMap', {
      initialLat: latitude,
      initialLng: longitude,
      onPickLocation: (location: MapLocation) => {
        onPickLocation(formatMapsLink(location));
      },
      hasInitialLocation: hasInitialLocation,
    });
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon={Icons.locate}
        onPress={pickOnMapHandler}
        size={32}
        containerStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
  },
  button: {
    marginVertical: '15%',
  },
});

export default LocationPicker;
