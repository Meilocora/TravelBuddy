import { ReactElement, useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { Icons, JourneyBottomTabsParamsList } from '../../models';
import MajorStageList from '../../components/MajorStage/MajorStageList';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import IconButton from '../../components/UI/IconButton';

interface PlanningProps {
  navigation: NativeStackNavigationProp<
    JourneyBottomTabsParamsList,
    'Planning'
  >;
  route: RouteProp<JourneyBottomTabsParamsList, 'Planning'>;
}

// TODO: Add Description of Journey + Journey stats
// TODO: Tell user when there are gaps between major stages
// TODO: Hide stages, that are already over (and make visible by button)
const Planning: React.FC<PlanningProps> = ({
  route,
  navigation,
}): ReactElement => {
  let { journeyId, journeyName } = route.params;

  function handleAddMajorStage() {
    navigation.navigate('MajorStageStackNavigator', {
      screen: 'ManageMajorStage',
      params: { journeyId: journeyId },
    });
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
    <View style={styles.root}>
      <MajorStageList journeyId={journeyId!} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default Planning;
