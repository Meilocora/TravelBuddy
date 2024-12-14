import { ReactElement, useLayoutEffect } from 'react';
import { View } from 'react-native';

import { PlanningRouteProp, StackParamList } from '../../models';
import MajorStageList from '../../components/MajorStage/MajorStageList';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface PlanningProps {
  route: PlanningRouteProp;
}

const Planning: React.FC<PlanningProps> = ({ route }): ReactElement => {
  const { journeyId, journeyName } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: journeyName,
    });
  }, [navigation, journeyName]);

  return (
    <View>
      <MajorStageList journeyId={journeyId} />
    </View>
  );
};

export default Planning;
