import { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface OverviewProps {}

const Overview: React.FC<OverviewProps> = (): ReactElement => {
  // TODO: Add Description of Journey + Journey stats

  return (
    <View style={styles.root}>
      <Text>Overview</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default Overview;
