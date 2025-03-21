import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement, useLayoutEffect } from 'react';
import { Text } from 'react-native';
import { MajorStageStackParamList } from '../../../models';
import { RouteProp } from '@react-navigation/native';
import ComplementaryGradient from '../../../components/UI/LinearGradients/ComplementaryGradient';
import { GlobalStyles } from '../../../constants/styles';

interface ManageAccommodationProps {
  navigation: NativeStackNavigationProp<
    MajorStageStackParamList,
    'ManageAccommodation'
  >;
  route: RouteProp<MajorStageStackParamList, 'ManageAccommodation'>;
}

const ManageAccommodation: React.FC<ManageAccommodationProps> = ({
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
      <Text>Manage Accommodation</Text>
    </>
  );
};

export default ManageAccommodation;
