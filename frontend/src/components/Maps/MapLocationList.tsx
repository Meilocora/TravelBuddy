import { ReactElement, useState } from 'react';
import { Location } from '../../utils/http';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import MapLocationListElement from './MapLocationListElement';
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

interface MapLocationListProps {
  locations: Location[];
  mapScope: string;
  onPress: (location: Location) => void;
}

const MapLocationList: React.FC<MapLocationListProps> = ({
  locations,
  mapScope,
  onPress,
}): ReactElement => {
  const [selectedLocation, setSelectedLocation] = useState<
    string | undefined
  >();

  const isFocused = useIsFocused();

  useFocusEffect(() => {
    if (!isFocused) {
      setSelectedLocation(undefined); // Reset only when the screen loses focus
    }
  });

  const uniqueLocations = locations.filter((location, index, self) => {
    return (
      self.findIndex((loc) => loc.data.name === location.data.name) === index
    );
  });

  const screenHeight = Dimensions.get('window').height;

  function handlePressListElement(location: Location) {
    setSelectedLocation(location.data.name);
    onPress(location);
  }

  // TODO: make button, that shows the names

  return (
    <Animated.View
      entering={SlideInLeft}
      exiting={SlideOutLeft}
      style={[styles.container, { maxHeight: screenHeight * 0.75 }]}
    >
      <ScrollView>
        {uniqueLocations.map((location) => (
          <MapLocationListElement
            location={location}
            onPress={handlePressListElement}
            selected={selectedLocation === location.data.name}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: '10%',
    zIndex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'black',
    borderWidth: 1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
});

export default MapLocationList;
