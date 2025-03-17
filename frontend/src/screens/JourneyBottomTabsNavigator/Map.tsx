import { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface MapProps {}

const Map: React.FC<MapProps> = (): ReactElement => {
  return (
    <View style={styles.root}>
      <Text>Map</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default Map;
