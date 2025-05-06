import { ReactElement } from 'react';
import { Location } from '../../utils/http';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { generateRandomString } from '../../utils';

interface MapLocationListProps {
  locations: Location[];
}

const MapLocationList: React.FC<MapLocationListProps> = ({
  locations,
}): ReactElement => {
  const uniqueLocations = locations
    .filter((location, index, self) => {
      return (
        self.findIndex((loc) => loc.data.name === location.data.name) === index
      );
    })
    .sort((a, b) => a.data.name.localeCompare(b.data.name));

  function onPressListElement() {
    // TODO: setRegion to lat & lng of locations
  }

  // TODO: Sort by:
  //  belonging OR if scope = majorStage => minorStageName
  //  locationType => transport_departure, transport_arrival, accommodation, placeToVisit, activity
  // TODO: Add little icon next to name
  // TODO: make button, that shows the names

  return (
    <ScrollView style={styles.container}>
      {uniqueLocations.map((location) => (
        <View key={generateRandomString()} style={styles.textContainer}>
          <Text
            style={[styles.text, { color: location.color }]}
            numberOfLines={1}
          >
            {location.data.name}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    position: 'absolute',
    top: '10%',
    left: '5%',
    zIndex: 1,
  },
  textContainer: {
    maxWidth: 150,
  },
  text: {},
});

export default MapLocationList;
