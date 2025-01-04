import { ReactElement } from 'react';
import { Text, View } from 'react-native';

interface ManageMajorStageProps {}

const ManageMajorStage: React.FC<ManageMajorStageProps> = (): ReactElement => {
  // TODO: Change background for everything ... maybe new Navigation Stack?

  return (
    <View>
      <Text>Manage Major Stage</Text>
    </View>
  );
};

export default ManageMajorStage;
