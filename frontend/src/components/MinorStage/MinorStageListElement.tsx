import { ReactElement, useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { Icons, MajorStageStackParamList, MinorStage } from '../../models';
import ElementTitle from '../UI/list/ElementTitle';
import ElementComment from '../UI/list/ElementComment';
import { formatDateString } from '../../utils';
import { GlobalStyles } from '../../constants/styles';
import ContentBox from '../UI/contentbox/ContentBox';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JourneyContext } from '../../store/journey-context';
import { MajorStageContext } from '../../store/majorStage-context.';
import IconButton from '../UI/IconButton';

interface MinorStageListElementProps {
  minorStage: MinorStage;
}

const MinorStageListElement: React.FC<MinorStageListElementProps> = ({
  minorStage,
}): ReactElement => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MajorStageStackParamList>>();

  const journeyCtx = useContext(JourneyContext);
  const majorStageCtx = useContext(MajorStageContext);

  const majorStageId = majorStageCtx.majorStages.find((majorStage) =>
    majorStage.minorStagesIds!.includes(minorStage.id)
  )!.id;
  const journeyId = journeyCtx.journeys.find((journey) =>
    journey.majorStagesIds!.includes(majorStageId)
  )!.id;

  const startDate = formatDateString(minorStage.scheduled_start_time);
  const endDate = formatDateString(minorStage.scheduled_end_time);

  function handleEdit() {
    navigation.navigate('ManageMinorStage', {
      journeyId: journeyId,
      majorStageId: majorStageId,
      minorStageId: minorStage.id,
    });
  }

  function handleAddTransportation() {
    // navigation.navigate('MajorStageStackNavigator', {
    //   screen: 'ManageTransportation',
    //   params: {
    //     journeyId: journeyId,
    //     majorStageId: majorStage.id,
    //   },
    // });
  }

  function handleEditTransportation() {
    // navigation.navigate('MajorStageStackNavigator', {
    //   screen: 'ManageTransportation',
    //   params: {
    //     journeyId: journeyId,
    //     majorStageId: majorStage.id,
    //     transportationId: majorStage.transportation!.id,
    //   },
    // });
  }

  return (
    <View style={styles.container}>
      <ElementTitle style={styles.heading}>{minorStage.title}</ElementTitle>
      <IconButton
        icon={Icons.edit}
        color={GlobalStyles.colors.accent800}
        onPress={handleEdit}
      />
      <ElementComment content={`${startDate} - ${endDate}`} />
      <ContentBox minorStage={minorStage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    backgroundColor: GlobalStyles.colors.complementary100,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: GlobalStyles.colors.complementary700,
  },
  heading: {
    fontSize: 16,
  },
});

export default MinorStageListElement;
