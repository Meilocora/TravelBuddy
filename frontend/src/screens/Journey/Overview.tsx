import { ReactElement } from 'react';
import { Text, View } from 'react-native';

interface OverviewProps {}

const Overview: React.FC<OverviewProps> = (): ReactElement => {
  return (
    <View>
      <Text>Overview</Text>
    </View>
  );
};

export default Overview;
