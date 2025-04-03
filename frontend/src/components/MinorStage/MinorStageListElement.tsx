import { ReactElement, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Icons, MajorStageStackParamList, MinorStage } from '../../models';
import ElementTitle from '../UI/list/ElementTitle';
import ElementComment from '../UI/list/ElementComment';
import {
  formatAmount,
  formatDateString,
  formatDurationToDays,
} from '../../utils';
import { GlobalStyles } from '../../constants/styles';
import ContentBox from '../UI/contentbox/ContentBox';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JourneyContext } from '../../store/journey-context';
import { MajorStageContext } from '../../store/majorStage-context.';
import IconButton from '../UI/IconButton';
import DetailArea from '../UI/list/DetailArea';

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

  const majorStage = majorStageCtx.majorStages.find((majorStage) =>
    majorStage.minorStagesIds!.includes(minorStage.id)
  );
  const majorStageId = majorStage?.id!;

  const journey = journeyCtx.journeys.find((journey) =>
    journey.majorStagesIds!.includes(majorStageId)
  );
  const journeyId = journey?.id!;

  const startDate = formatDateString(minorStage.scheduled_start_time);
  const endDate = formatDateString(minorStage.scheduled_end_time);
  const durationInDays = formatDurationToDays(
    minorStage.scheduled_start_time,
    minorStage.scheduled_end_time
  );
  const moneyAvailable = formatAmount(minorStage.costs.budget);
  const moneyPlanned = formatAmount(minorStage.costs.spent_money);

  const elementDetailInfo = [
    {
      title: 'Duration',
      value: `${durationInDays} days`,
    },
    {
      title: 'Costs',
      value: `${moneyPlanned} / ${moneyAvailable}`,
    },
  ];

  const elementAccommodationDetailInfo = [
    {
      title: 'Name',
      value: `${minorStage.accommodation.name} `,
    },
    {
      title: 'Place',
      value: `${minorStage.accommodation.place} `,
    },
    {
      title: 'Costs',
      value: formatAmount(minorStage.accommodation.costs),
    },
    {
      title: 'Booked',
      value: minorStage.accommodation.booked ? 'Yes' : 'No',
    },
  ];

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

  // TODO: for accommodation => name = accommodation (booked), costs = accommodation costs, delete place everywhere
  // TODO: Delete name or place for accommodation everywhere
  // TODO: Implement transportation handling
  // TODO: Implement places handling
  // TODO: Implement activities handling
  // TODO: Implement spendings handling

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
      <DetailArea elementDetailInfo={elementDetailInfo} />
      {minorStage.accommodation.name !== '' && (
        <View>
          {/* TODO: style this textline */}
          <Text>Accommodation</Text>
          <DetailArea elementDetailInfo={elementAccommodationDetailInfo} />
        </View>
      )}
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
