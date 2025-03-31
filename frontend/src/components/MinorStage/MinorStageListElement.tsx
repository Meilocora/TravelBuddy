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

  // TODO: Proper styling of component analog to majorStageListComponent
  // TODO: Finish deleting and updating minor stages
  // TODO: Implement transportation handling
  // TODO: Implement places handling
  // TODO: Implement activities handling

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ElementTitle>{minorStage.title}</ElementTitle>
        <IconButton
          icon={Icons.edit}
          color={GlobalStyles.colors.accent800}
          onPress={handleEdit}
        />
      </View>
      <ElementComment content={`${startDate} - ${endDate}`} />
      {/* TODO: Display Accommodation info and costs here like in MajorStageListElement*/}
      <ContentBox minorStage={minorStage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: GlobalStyles.colors.complementary700,
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: GlobalStyles.colors.complementary100,
  },
  headerContainer: {
    flex: 1,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

export default MinorStageListElement;
