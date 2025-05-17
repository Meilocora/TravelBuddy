import { ReactElement, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  Activity,
  Icons,
  JourneyBottomTabsParamsList,
  MajorStageStackParamList,
} from '../../../models';
import { GlobalStyles } from '../../../constants/styles';
import IconButton from '../../UI/IconButton';
import { StagesContext } from '../../../store/stages-context';

interface ActivityContentProps {
  minorStageId: number;
  activity: Activity;
}

const ActivityContent: React.FC<ActivityContentProps> = ({
  minorStageId,
  activity,
}): ReactElement => {
  const navigation =
    useNavigation<NativeStackNavigationProp<JourneyBottomTabsParamsList>>();

  const stagesCtx = useContext(StagesContext);
  const majorStage = stagesCtx.findMinorStagesMajorStage(minorStageId);
  const journey = stagesCtx.findMajorStagesJourney(majorStage?.id!);

  function handleGoToActivity() {
    stagesCtx.setActiveHeaderHandler(minorStageId, 'activities');
    navigation.navigate('MajorStageStackNavigator', {
      screen: 'MinorStages',
      params: {
        journeyId: journey!.id,
        majorStageId: majorStage!.id,
      },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Text style={styles.header}>{activity.name}</Text>
      </View>
      {activity.description && (
        <View style={styles.textRow}>
          <Text style={styles.description}>{activity.description}</Text>
        </View>
      )}
      <View style={styles.textRow}>
        <IconButton
          icon={Icons.goTo}
          onPress={handleGoToActivity}
          color={GlobalStyles.colors.visited}
          containerStyle={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    marginHorizontal: 'auto',
    width: '80%',
    maxHeight: '30%',
    backgroundColor: GlobalStyles.colors.gray200,
    justifyContent: 'flex-end',
    borderWidth: 2,
    borderColor: GlobalStyles.colors.gray500,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    marginVertical: 2,
    color: GlobalStyles.colors.gray200,
    fontSize: 14,
    fontStyle: 'italic',
  },
  button: {
    marginHorizontal: 0,
    paddingHorizontal: 4,
  },
});

export default ActivityContent;
