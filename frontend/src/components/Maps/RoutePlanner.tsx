import { ReactElement, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View, Text } from 'react-native';
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import OutsidePressHandler from 'react-native-outside-press';
import { MapViewDirectionsMode } from 'react-native-maps-directions';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { generateRandomString } from '../../utils';
import IconButton from '../UI/IconButton';
import { ButtonMode, ColorScheme, Icons, Location } from '../../models';
import Button from '../UI/Button';

import { GlobalStyles } from '../../constants/styles';
import RoutePlannerList from './RoutePlannerList';

interface RoutePlannerProps {
  locations: Location[];
  mapScope: string;
  mode: MapViewDirectionsMode;
  toggleButtonVisibility: () => void;
  showContent: { button: boolean; list: boolean };
  setMode: (mode: MapViewDirectionsMode) => void;
  onPress: (location: Location) => void;
}

const RoutePlanner: React.FC<RoutePlannerProps> = ({
  locations,
  mapScope,
  mode,
  toggleButtonVisibility,
  showContent,
  setMode,
  onPress,
}): ReactElement => {
  const [routeLocations, setRouteLocations] = useState<string[]>([]);

  const isFocused = useIsFocused();

  // useFocusEffect(() => {
  //   if (!isFocused) {
  //     setRouteLocations(undefined); // Reset only when the screen loses focus
  //   }
  // });

  // useEffect(() => {
  //   setRouteLocations(undefined);
  // }, [mapScope]);

  function handlePressListElement(location: Location) {
    // setRouteLocations(location.data.name);
    onPress(location);
    toggleButtonVisibility();
  }

  function handleAddElement(loc: string) {
    setRouteLocations((prevValues) => [...prevValues, loc]);
  }

  function handleRemoveElement(loc: string) {
    setRouteLocations((prevValues) =>
      prevValues.filter((item) => item !== loc)
    );
  }

  return (
    <>
      {showContent.button && (
        <Animated.View
          style={styles.buttonContainer}
          entering={SlideInLeft}
          exiting={SlideOutLeft}
        >
          <IconButton
            icon={Icons.routePlanner}
            onPress={toggleButtonVisibility}
            color='black'
            size={36}
            style={{ marginLeft: 6 }}
          />
        </Animated.View>
      )}
      {showContent.list && (
        <Animated.View
          entering={SlideInLeft}
          exiting={SlideOutLeft}
          style={styles.container}
        >
          <OutsidePressHandler
            onOutsidePress={toggleButtonVisibility}
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
              {/* {routeLocations &&
                routeLocations.map((location) => (
                  <View
                    key={`${location.data.latitude}-${location.data.longitude}`}
                  >
                    <Text>{location.data.name}</Text>
                  </View>
                ))} */}
              <RoutePlannerList
                locations={locations}
                routeElements={routeLocations}
                onAddElement={handleAddElement}
                onRemoveElement={handleRemoveElement}
              />
            </ScrollView>
            <View>
              <Button
                colorScheme={ColorScheme.neutral}
                onPress={toggleButtonVisibility}
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
    top: '50%',
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

export default RoutePlanner;
