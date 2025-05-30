import { ReactElement, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { Icons, MajorStageStackParamList, MinorStage } from '../../models';
import ElementTitle from '../UI/list/ElementTitle';
import ElementComment from '../UI/list/ElementComment';
import {
  formatAmount,
  formatDateString,
  formatDurationToDays,
  parseDate,
} from '../../utils';
import { GlobalStyles } from '../../constants/styles';
import ContentBox from '../UI/contentbox/ContentBox';
import { JourneyContext } from '../../store/journey-context';
import { MajorStageContext } from '../../store/majorStage-context.';
import IconButton from '../UI/IconButton';
import DetailArea, { ElementDetailInfo } from '../UI/list/DetailArea';
import AccommodationBox from './AccommodationBox';
import CustomProgressBar from '../UI/CustomProgressBar';

interface MinorStageListElementProps {
  minorStage: MinorStage;
  onDelete: (minorStageId: number) => void;
}

const MinorStageListElement: React.FC<MinorStageListElementProps> = ({
  minorStage,
  onDelete,
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
  const isOver = parseDate(minorStage.scheduled_end_time) < new Date();

  const elementDetailInfo: ElementDetailInfo[] = [
    {
      icon: Icons.duration,
      value: `${durationInDays} days`,
    },
    {
      icon: Icons.currency,
      value: `${moneyPlanned} / ${moneyAvailable}`,
      textStyle: minorStage.costs.money_exceeded
        ? { color: GlobalStyles.colors.error200, fontWeight: 'bold' }
        : undefined,
    },
  ];

  function handleEdit() {
    navigation.navigate('ManageMinorStage', {
      journeyId: journeyId,
      majorStageId: majorStageId,
      minorStageId: minorStage.id,
    });
  }

  // TODO: Highlight active minor stage

  return (
    <View style={[styles.container, isOver && styles.inactiveContainer]}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <ElementTitle>{minorStage.title}</ElementTitle>
        </View>
        <View style={styles.iconContainer}>
          {!isOver ? (
            <IconButton
              icon={Icons.edit}
              color={GlobalStyles.colors.accent800}
              onPress={handleEdit}
            />
          ) : (
            <IconButton
              icon={Icons.delete}
              color={GlobalStyles.colors.gray500}
              onPress={() => onDelete(minorStage.id)}
            />
          )}
        </View>
      </View>
      <ElementComment content={`${startDate} - ${endDate}`} />
      <DetailArea elementDetailInfo={elementDetailInfo} />
      {minorStage.accommodation.place !== '' && (
        <AccommodationBox minorStage={minorStage} />
      )}
      <ContentBox
        journeyId={journeyId}
        majorStageId={majorStageId}
        minorStage={minorStage}
      />
      {/* <CustomProgressBar
        startDate={minorStage.scheduled_start_time}
        endDate={minorStage.scheduled_end_time}
      /> */}
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
  inactiveContainer: {
    borderColor: GlobalStyles.colors.gray400,
    backgroundColor: GlobalStyles.colors.gray100,
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
