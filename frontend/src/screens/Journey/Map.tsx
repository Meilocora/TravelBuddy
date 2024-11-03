import { ReactElement } from 'react';
import { Text, View } from 'react-native';

interface MapProps {}

const Map: React.FC<MapProps> = (): ReactElement => {
  return (
    <View>
      <Text>Map</Text>
    </View>
  );
};

export default Map;
