import React, { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SecondaryGradient from '../components/UI/LinearGradients/SecondaryGradient';

interface ManageMajorStageProps {}

const ManageMajorStage: React.FC<ManageMajorStageProps> = (): ReactElement => {
  // TODO: Implement Manage Major Stage
  // 1. Logic for Managing (Add or Update)
  // 2. Form for Managing Major Stage
  // 3. HTTP Requests
  // 4. Backend Integration

  return (
    <View style={styles.root}>
      <SecondaryGradient />
      <View>
        <Text>Manage Major Stage</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default ManageMajorStage;
