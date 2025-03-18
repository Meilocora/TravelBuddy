import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement, useLayoutEffect } from 'react';
import { Text } from 'react-native';
import { MajorStageStackParamList } from '../../../models';
import { RouteProp } from '@react-navigation/native';
import ComplementaryGradient from '../../../components/UI/LinearGradients/ComplementaryGradient';
import { GlobalStyles } from '../../../constants/styles';

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
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: GlobalStyles.colors.complementary700 },
    });
  }, [navigation]);

  return (
    <>
      <ComplementaryGradient />
      <Text>Manage Minor Stage</Text>
    </>
  );
};

export default ManageMinorStage;
