import React, { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SecondaryGradient from '../components/UI/LinearGradients/SecondaryGradient';

interface ManageMajorStageProps {}

const ManageMajorStage: React.FC<ManageMajorStageProps> = (): ReactElement => {
  return (
    <>
      <SecondaryGradient />
      <View style={styles.root}>
        <Text>Manage Major Stage</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ManageMajorStage;
