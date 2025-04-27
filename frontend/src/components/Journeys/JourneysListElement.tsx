import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { BottomTabsParamList, Icons, Journey } from '../../models';
import { GlobalStyles } from '../../constants/styles';
import {
  formatAmount,
  formatDateString,
  formatDurationToDays,
  formatProgress,
} from '../../utils';
import CustomProgressBar from '../UI/CustomProgressBar';
import { StackParamList } from '../../models';
import ElementTitle from '../UI/list/ElementTitle';
import DetailArea, { ElementDetailInfo } from '../UI/list/DetailArea';
import IconButton from '../UI/IconButton';
import ElementComment from '../UI/list/ElementComment';
import { MajorStageContext } from '../../store/majorStage-context.';
import { JourneyContext } from '../../store/journey-context';
import { fetchJourneysMinorStagesQty } from '../../utils/http';

interface JourneyListElementProps {
  journey: Journey;
}

const JourneyListElement: React.FC<JourneyListElementProps> = ({
  journey,
}): ReactElement => {
  const journeyCtx = useContext(JourneyContext);
  const majorStageCtx = useContext(MajorStageContext);
  const [minorStagesQty, setMinorStagesQty] = useState<number>(0);
  const moneyAvailable = formatAmount(journey.costs.budget);
  const moneyPlanned = formatAmount(journey.costs.spent_money);
  const startDate = formatDateString(journey.scheduled_start_time);
  const endDate = formatDateString(journey.scheduled_end_time);
  const durationInDays = formatDurationToDays(
    journey.scheduled_start_time,
    journey.scheduled_end_time
  );
  let majorStagesCounter = 0;
  if (journey.majorStagesIds) {
    majorStagesCounter = journey.majorStagesIds.length;
    for (const id of journey.majorStagesIds) {
      const majorStage = majorStageCtx.majorStages.find(
        (stage) => stage.id === id
      );
    }
  }

  useEffect(() => {
    async function fetchMinorStagesQty() {
      const response = await fetchJourneysMinorStagesQty(journey.id);
      if (response.status === 200 && response.minorStagesQty) {
        setMinorStagesQty(response.minorStagesQty!);
      }
    }
    fetchMinorStagesQty();
  }, []);

  const elementDetailInfo: ElementDetailInfo[] = [
    { icon: Icons.duration, value: `${durationInDays} days` },
    {
      icon: Icons.currency,
      value: `${moneyPlanned} / ${moneyAvailable}`,
      textStyle: journey.costs.money_exceeded
        ? { color: GlobalStyles.colors.error200 }
        : undefined,
    },
    { title: 'Major Stages', value: majorStagesCounter.toString() },
    { title: 'Minor Stages', value: minorStagesQty.toString() },
  ];

  const progress = formatProgress(
    journey.scheduled_start_time,
    journey.scheduled_end_time
  );

  const navigationJourneyBottomTabs =
    useNavigation<NavigationProp<StackParamList>>();

  function handleOnPress() {
    journeyCtx.setSelectedJourneyId(journey.id);
    navigationJourneyBottomTabs.navigate('JourneyBottomTabsNavigator', {
      screen: 'Planning',
      params: { journeyId: journey.id },
    });
  }

  const navigationBottomTabs =
    useNavigation<NavigationProp<BottomTabsParamList>>();

  function handleEdit() {
    navigationBottomTabs.navigate('ManageJourney', { journeyId: journey.id });
  }

  // TODO: Highlight current Country
  // TODO: Add Countdown till journey starts
  // TODO: Journey should start automatically, when start date is reached
  // TODO: Blend out the past journeys (show with new button)
  // TODO: Give active journey a different borderColor

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={['#ced4da', '#5b936c']}
        style={{ height: '100%' }}
      >
        <Pressable
          style={({ pressed }) => pressed && styles.pressed}
          android_ripple={{ color: GlobalStyles.colors.primary100 }}
          onPress={handleOnPress}
        >
          <View style={styles.innerContainer}>
            <View style={styles.headerContainer}>
              <ElementTitle>{journey.name}</ElementTitle>
              <IconButton
                icon={Icons.edit}
                color={GlobalStyles.colors.primary500}
                onPress={handleEdit}
              />
            </View>
            <ElementComment content={`${startDate} - ${endDate}`} />
            <DetailArea
              elementDetailInfo={elementDetailInfo}
              areaStyle={styles.detailArea}
            />
            <Text style={styles.countriesList}>{journey.countries!}</Text>
          </View>
          {/* <CustomProgressBar progress={progress} /> */}
        </Pressable>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    borderColor: GlobalStyles.colors.primary400,
    borderWidth: 2,
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 32,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    elevation: 5,
    shadowColor: GlobalStyles.colors.gray500,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.5,
  },
  innerContainer: {
    padding: 10,
    alignItems: 'center',
  },
  headerContainer: {
    flex: 1,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  countriesList: {
    marginVertical: 8,
    fontStyle: 'italic',
  },
  detailArea: {
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary500,
  },
});

export default JourneyListElement;
