import { ReactElement, useContext, useState } from 'react';
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
import DetailArea, { ElementDetailInfo } from '../UI/list/DetailArea';

interface MinorStageListElementProps {
  minorStage: MinorStage;
  contentState: { activeHeader: string };
  setContentState: React.Dispatch<
    React.SetStateAction<{ activeHeader: string }>
  >;
}

const MinorStageListElement: React.FC<MinorStageListElementProps> = ({
  minorStage,
  contentState,
  setContentState,
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

  const elementDetailInfo: ElementDetailInfo[] = [
    {
      title: 'Duration',
      value: `${durationInDays} days`,
    },
    {
      title: 'Costs',
      value: `${moneyPlanned} / ${moneyAvailable}`,
      textStyle: minorStage.costs.money_exceeded
        ? { color: GlobalStyles.colors.error200, fontWeight: 'bold' }
        : undefined,
    },
  ];

  // TODO: Make this separate ... header: Accommodation an then Name (Price), Link for Maps and if booked (Ionicon Bookmark?)
  if (minorStage.accommodation.place !== '') {
    elementDetailInfo.push(
      {
        title: 'Accommodation',
        value: minorStage.accommodation.place,
        link: minorStage.accommodation.link,
      },
      {
        title: 'Price',
        value: formatAmount(minorStage.accommodation.costs),
      },
      {
        title: 'Booked',
        value: minorStage.accommodation.booked ? 'Yes' : 'No',
      }
    );
  }

  if (minorStage.accommodation.maps_link !== '') {
    elementDetailInfo.push({
      title: 'Maps link',
      value: minorStage.accommodation.maps_link !== '' ? 'Show me' : '',
      link:
        minorStage.accommodation.maps_link !== ''
          ? minorStage.accommodation.maps_link
          : undefined,
    });
  }

  function handleEdit() {
    navigation.navigate('ManageMinorStage', {
      journeyId: journeyId,
      majorStageId: majorStageId,
      minorStageId: minorStage.id,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <ElementTitle>{minorStage.title}</ElementTitle>
        </View>
        <View style={styles.iconContainer}>
          <IconButton
            icon={Icons.edit}
            color={GlobalStyles.colors.accent800}
            onPress={handleEdit}
          />
        </View>
      </View>
      <ElementComment content={`${startDate} - ${endDate}`} />
      <DetailArea elementDetailInfo={elementDetailInfo} />
      <ContentBox
        journeyId={journeyId}
        majorStageId={majorStageId}
        minorStage={minorStage}
        contentState={contentState}
        setContentState={setContentState}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 8.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MinorStageListElement;
