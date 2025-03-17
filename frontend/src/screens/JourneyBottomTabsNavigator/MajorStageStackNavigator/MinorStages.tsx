import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement } from 'react';
import { Text } from 'react-native';
import { MajorStageStackParamList } from '../../../models';
import { RouteProp } from '@react-navigation/native';

interface MinorStagesProps {
  navigation: NativeStackNavigationProp<
    MajorStageStackParamList,
    'MinorStages'
  >;
  route: RouteProp<MajorStageStackParamList, 'MinorStages'>;
}

const MinorStages: React.FC<MinorStagesProps> = ({
  route,
  navigation,
}): ReactElement => {
  return <Text>Minor Stages</Text>;
};

export default MinorStages;
