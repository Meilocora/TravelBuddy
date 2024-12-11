import {
  ReactElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  ManagePlaceToVisitRouteProp,
  PlaceValues,
  StackParamList,
} from '../models';
import { PlaceContext } from '../store/place-context';
import { useFocusEffect } from '@react-navigation/native';
import PlaceForm from '../components/Locations/Places/PlaceForm';

interface ManagePlaceToVisitProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ManagePlaceToVisit'>;
  route: ManagePlaceToVisitRouteProp;
}

const ManagePlaceToVisit: React.FC<ManagePlaceToVisitProps> = ({
  navigation,
  route,
}): ReactElement => {
  const [error, setError] = useState<string | null>(null);

  const placeCtx = useContext(PlaceContext);
  const placeId = route.params?.placeId;
  let isEditing = !!placeId;

  const selectedPlace = placeCtx.placesToVisit.find(
    (place) => place.id === placeId
  );

  // Empty, when no default values provided
  const [placeValues, setPlaceValues] = useState<PlaceValues>({
    name: selectedPlace?.name || '',
    description: selectedPlace?.description || '',
    visited: selectedPlace?.visited || false,
    favorite: selectedPlace?.favorite || false,
    link: selectedPlace?.link || '',
    maps_link: selectedPlace?.maps_link || '',
  });

  // TODO: Check if this is necessary
  useFocusEffect(
    useCallback(() => {
      // PlaceValues set, when screen is focused
      setPlaceValues({
        name: selectedPlace?.name || '',
        description: selectedPlace?.description || '',
        visited: selectedPlace?.visited || false,
        favorite: selectedPlace?.favorite || false,
        link: selectedPlace?.link || '',
        maps_link: selectedPlace?.maps_link || '',
      });

      return () => {
        // TODO: Check if this is necessary
        // Clean up function, when screen is unfocused
        // reset PlaceValues
        setPlaceValues({
          name: '',
          description: '',
          visited: false,
          favorite: false,
          link: '',
          maps_link: '',
        });
      };
    }, [])
  );

  // function confirmHandler({ status, error, place }: ConfirmHandlerProps) {
  //   if (isEditing) {
  //     if (error) {
  //       setError(error);
  //       return;
  //     } else if (place && status === 200) {
  //       placeCtx.updatePlace(place);
  //       // const popupText = 'Place successfully updated!';
  //       // navigation.navigate('AllJourneys', { popupText: popupText });
  //     }
  //   } else {
  //     if (error) {
  //       setError(error);
  //       return;
  //     } else if (place && status === 201) {
  //       placeCtx.addPlace(place);
  //       // const popupText = 'Journey successfully created!';
  //       // navigation.navigate('AllJourneys', { popupText: popupText });
  //     }
  //   }
  // }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      title: isEditing ? `Manage ${selectedPlace?.name}` : 'Add Place',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <PlaceForm
        onCancel={() => navigation.goBack()}
        onSubmit={() => {}}
        submitButtonLabel='Add'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ManagePlaceToVisit;
