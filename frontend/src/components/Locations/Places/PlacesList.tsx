import { ReactElement } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

import PlacesListItem from './PlacesListItem';
import { generateRandomString } from '../../../utils';
import Button from '../../UI/Button';
import { ButtonMode, ColorScheme } from '../../../models';
import { GlobalStyles } from '../../../constants/styles';

interface PlacesListProps {
  onCancel: () => void;
}

// TODO: UseEffect to get Places for this Country
// TODO: Places Context (must contain all Places of a user => places need user id aswell)

const PLACES = [
  {
    id: 1,
    name: 'Place 1',
    description: 'Description 1',
    visited: false,
    favorite: false,
  },
  {
    id: 2,
    name: 'Place 2',
    description: 'Description 2',
    visited: false,
    favorite: false,
  },
  {
    id: 3,
    name: 'Place 3',
    description: 'Description 3',
    visited: false,
    favorite: false,
  },
];

// TODO: Turn into Scrollview
const PlacesList: React.FC<PlacesListProps> = ({ onCancel }): ReactElement => {
  return (
    <BlurView intensity={85} tint='dark' style={styles.blurcontainer}>
      <Animated.View
        entering={FadeInDown}
        exiting={FadeOutDown}
        style={styles.container}
      >
        <Text style={{ color: 'white' }}>Places to Visit</Text>
        <View>
          {PLACES.length > 0 &&
            PLACES.map((place, index) => (
              <PlacesListItem key={generateRandomString()} place={place} />
            ))}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            mode={ButtonMode.flat}
            onPress={onCancel}
            colorScheme={ColorScheme.neutral}
          >
            Cancel
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
    marginHorizontal: 'auto',
    marginVertical: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    padding: 24,
    backgroundColor: GlobalStyles.colors.gray700,
    borderRadius: 20,
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
