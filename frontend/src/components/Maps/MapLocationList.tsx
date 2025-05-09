import { ReactElement, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import MapLocationListElement from './MapLocationListElement';
import Animated, {
  FadeInDown,
  FadeOutUp,
  SlideInLeft,
  SlideOutLeft,
} from 'react-native-reanimated';
import OutsidePressHandler from 'react-native-outside-press';
import { MapViewDirectionsMode } from 'react-native-maps-directions';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { Location } from '../../utils/http';
import { generateRandomString } from '../../utils';
import IconButton from '../UI/IconButton';
import { ButtonMode, ColorScheme, Icons } from '../../models';
import Button from '../UI/Button';

import { GlobalStyles } from '../../constants/styles';

interface MapLocationListProps {
  locations: Location[];
  mapScope: string;
  mode: MapViewDirectionsMode;
  setMode: (mode: MapViewDirectionsMode) => void;
  onPress: (location: Location) => void;
}

const MapLocationList: React.FC<MapLocationListProps> = ({
  locations,
  mapScope,
  mode,
  setMode,
  onPress,
}): ReactElement => {
  const [showList, setShowList] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<
    string | undefined
  >();

  const isFocused = useIsFocused();

  useFocusEffect(() => {
    if (!isFocused) {
      setSelectedLocation(undefined); // Reset only when the screen loses focus
    }
  });

  useEffect(() => {
    setSelectedLocation(undefined);
  }, [mapScope]);

  const uniqueLocations = locations.filter((location, index, self) => {
    return (
      self.findIndex((loc) => loc.data.name === location.data.name) === index
    );
  });

  function handlePressListElement(location: Location) {
    setSelectedLocation(location.data.name);
    onPress(location);
    setShowList(false);
  }

  return (
    <>
      {!showList && (
        <Animated.View
          style={styles.buttonContainer}
          entering={FadeInDown}
          exiting={FadeOutUp}
        >
          <IconButton
            icon={Icons.listCircleOutline}
            onPress={() => setShowList((prevValue) => !prevValue)}
            color='black'
            size={40}
          />
        </Animated.View>
      )}
      {showList && (
        <Animated.View
          entering={SlideInLeft}
          exiting={SlideOutLeft}
          style={styles.container}
        >
          <OutsidePressHandler
            onOutsidePress={() => setShowList(false)}
            style={styles.innerContainer}
          >
            <View style={styles.buttonRow}>
              <IconButton
                icon={Icons.walk}
                onPress={() => setMode('WALKING')}
                color='black'
                containerStyle={
                  mode === 'WALKING' ? styles.activeButton : styles.button
                }
              />
              <IconButton
                icon={Icons.bicycle}
                onPress={() => setMode('BICYCLING')}
                color='black'
                containerStyle={
                  mode === 'BICYCLING' ? styles.activeButton : styles.button
                }
              />
              <IconButton
                icon={Icons.car}
                onPress={() => setMode('DRIVING')}
                color='black'
                containerStyle={
                  mode === 'DRIVING' ? styles.activeButton : styles.button
                }
              />
            </View>
            <ScrollView>
              {uniqueLocations.map((location) => (
                <MapLocationListElement
                  key={generateRandomString()}
                  location={location}
                  onPress={handlePressListElement}
                  selected={selectedLocation === location.data.name}
                />
              ))}
            </ScrollView>
            <View>
              <Button
                colorScheme={ColorScheme.neutral}
                onPress={() => setShowList((prevValue) => !prevValue)}
                mode={ButtonMode.flat}
                textStyle={styles.buttonText}
              >
                Dismiss
              </Button>
            </View>
          </OutsidePressHandler>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
  },
  innerContainer: {
    maxHeight: Dimensions.get('window').height * 0.7,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'black',
    borderWidth: 1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    top: '45%',
    zIndex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 5,
    marginHorizontal: 'auto',
  },
  button: {
    padding: 2,
    borderWidth: 1,
    borderRadius: '100%',
    borderColor: 'black',
  },
  activeButton: {
    padding: 2,
    borderWidth: 1,
    borderRadius: '100%',
    borderColor: 'black',
    backgroundColor: GlobalStyles.colors.accent100,
  },
  buttonText: {
    color: 'black',
  },
});

export default MapLocationList;
