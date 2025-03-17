import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement } from 'react';
import { Text } from 'react-native';
import { MajorStageStackParamList } from '../../../models';
import { RouteProp } from '@react-navigation/native';

interface ManageMinorStageProps {
  navigation: NativeStackNavigationProp<
    MajorStageStackParamList,
    'ManageMinorStage'
  >;
  route: RouteProp<MajorStageStackParamList, 'ManageMinorStage'>;
}

const ManageMinorStage: React.FC<ManageMinorStageProps> = ({
  route,
  navigation,
}): ReactElement => {
  return <Text>Manage Minor Stage</Text>;
};

export default ManageMinorStage;
