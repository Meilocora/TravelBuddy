import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location';
import { StyleSheet, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ReactElement, useEffect, useState } from 'react';

import { Icons, MapLocation, StackParamList } from '../../../models';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import IconButton from '../IconButton';
import { GlobalStyles } from '../../../constants/styles';

interface LocationPickerProps {
  pickedLocation?: MapLocation;
  onPickLocation: (location: MapLocation) => void;
  iconColor?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  pickedLocation,
  onPickLocation,
  iconColor,
}): ReactElement => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const [hasInitialLocation, setHasInitialLocation] = useState(false);

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
      initialTitle: pickedLocation?.title,
      initialLat: latitude,
      initialLng: longitude,
      onPickLocation: (location: MapLocation) => {
        onPickLocation(location);
      },
      hasLocation: hasInitialLocation,
    });
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon={hasInitialLocation ? Icons.map : Icons.mapFilled}
        onPress={pickOnMapHandler}
        size={32}
        containerStyle={styles.button}
        color={
          iconColor
            ? iconColor
            : hasInitialLocation
            ? GlobalStyles.colors.primary100
            : 'white'
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    marginVertical: 'auto',
  },
  button: {
    marginVertical: '15%',
  },
});

export default LocationPicker;
