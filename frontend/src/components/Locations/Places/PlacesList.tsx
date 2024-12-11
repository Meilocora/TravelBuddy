import { ReactElement } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

import PlacesListItem from './PlacesListItem';
import { generateRandomString } from '../../../utils';
import Button from '../../UI/Button';
import { ButtonMode, ColorScheme, StackParamList } from '../../../models';
import { GlobalStyles } from '../../../constants/styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface PlacesListProps {
  onCancel: () => void;
}

// TODO: UseEffect to get Places for this Country
// TODO: Places Context (must contain all Places of a user => places need user id aswell)

const PLACES = [
  {
    countryId: 1,
    id: 1,
    name: 'Place 1',
    description: 'Description 1',
    visited: true,
    favorite: false,
    link: 'https://www.google.com',
    maps_link: 'https://www.google.com/maps',
  },
  {
    countryId: 1,
    id: 2,
    name: 'Place 2',
    description: 'Description 2',
    visited: false,
    favorite: true,
  },
  {
    countryId: 1,
    id: 3,
    name: 'Place 3',
    description: 'Description 3',
    visited: false,
    favorite: false,
  },
];

const PlacesList: React.FC<PlacesListProps> = ({ onCancel }): ReactElement => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  function handleAdd() {
    navigation.navigate('ManagePlaceToVisit', { placeId: null });
  }

  return (
    <BlurView intensity={85} tint='dark' style={styles.blurcontainer}>
      <Animated.View
        entering={FadeInDown}
        exiting={FadeOutDown}
        style={styles.container}
      >
        <Text style={styles.header}>Places to Visit</Text>
        <ScrollView style={styles.listContainer}>
          {PLACES.length > 0 &&
            PLACES.map((place, index) => (
              <PlacesListItem key={generateRandomString()} place={place} />
            ))}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            mode={ButtonMode.flat}
            onPress={onCancel}
            colorScheme={ColorScheme.neutral}
          >
            Close
          </Button>
          <Button
            colorScheme={ColorScheme.primary}
            onPress={handleAdd}
            style={styles.button}
          >
            Add Place
          </Button>
        </View>
      </Animated.View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  blurcontainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    zIndex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    maxHeight: '60%',
    width: '80%',
    marginHorizontal: 'auto',
    marginVertical: 'auto',
    padding: 24,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.colors.gray700,
    borderRadius: 20,
  },
  header: {
    color: GlobalStyles.colors.gray50,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 22,
  },
  listContainer: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: GlobalStyles.colors.gray400,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    marginHorizontal: 4,
  },

  first: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  last: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default PlacesList;
