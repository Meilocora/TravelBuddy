import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ReactElement } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';

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
import DetailArea from '../UI/list/DetailArea';
import IconButton from '../UI/IconButton';
import { LinearGradient } from 'expo-linear-gradient';

interface JourneyListElementProps {
  journey: Journey;
}

const JourneyListElement: React.FC<JourneyListElementProps> = ({
  journey,
}): ReactElement => {
  const moneyAvailable = formatAmount(journey.costs.available_money);
  const moneyPlanned = formatAmount(journey.costs.planned_costs);
  const startDate = formatDateString(journey.scheduled_start_time);
  const endDate = formatDateString(journey.scheduled_end_time);
  const durationInDays = formatDurationToDays(
    journey.scheduled_start_time,
    journey.scheduled_end_time
  );

  const elementDetailInfo = [
    { title: 'Duration', value: `${durationInDays} days` },
    {
      title: 'Costs',
      value: `${moneyPlanned} / ${moneyAvailable}`,
      textStyle:
        moneyAvailable < moneyPlanned
          ? { color: GlobalStyles.colors.error200 }
          : undefined,
    },
    { title: 'Start Date', value: startDate },
    { title: 'End Date', value: endDate },
  ];

  const progress = formatProgress(
    journey.scheduled_start_time,
    journey.scheduled_end_time
  );

  const navigationJourneyBottomTabs =
    useNavigation<NavigationProp<StackParamList>>();

  function handleOnPress() {
    navigationJourneyBottomTabs.navigate('JourneyBottomTabsNavigator', {
      screen: 'Planning',
      params: { journeyId: journey.id, journeyName: journey.name },
    });
  }

  const navigationBottomTabs =
    useNavigation<NavigationProp<BottomTabsParamList>>();

  function handleEdit() {
    navigationBottomTabs.navigate('ManageJourney', { journeyId: journey.id });
  }

  // TODO: Highlight, when money exceeded
  // TODO: Add Major stages z.b. 3/5
  // TODO: Countrylist, mark countries that are visited
  // TODO: Add Countdown till journey starts
  // TODO: Journey should start automatically, when start date is reached

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
    borderColor: GlobalStyles.colors.primary400,
    borderWidth: 2,
    borderRadius: 20,
    flex: 1,
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
