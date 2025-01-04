import { ReactElement, useLayoutEffect } from 'react';
import { View } from 'react-native';

import { Icons, PlanningRouteProp, StackParamList } from '../../models';
import MajorStageList from '../../components/MajorStage/MajorStageList';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import IconButton from '../../components/UI/IconButton';

interface PlanningProps {
  route: PlanningRouteProp;
  navigation: NativeStackNavigationProp<StackParamList, 'ManageMajorStage'>;
}

// TODO: Change Background Color

const Planning: React.FC<PlanningProps> = ({ route }): ReactElement => {
  const { journeyId, journeyName } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  function handleAddMajorStage() {
    navigation.navigate('ManageMajorStage', { majorStageId: null });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: journeyName,
      headerRight: () => (
        <IconButton
          icon={Icons.add}
          onPress={handleAddMajorStage}
          color={'white'}
          size={32}
        />
      ),
    });
  }, [navigation, journeyName]);

  return (
    <View>
      <MajorStageList journeyId={journeyId} />
    </View>
  );
};

export default Planning;
