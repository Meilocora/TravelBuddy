import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ReactElement } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { Journey } from '../../models';
import { GlobalStyles } from '../../constants/styles';
import {
  formatAmount,
  formatDate,
  formatDurationToDays,
  formatProgress,
} from '../../utils';
import CustomProgressBar from '../UI/CustomProgressBar';
import { StackParamList } from '../../models';
import ElementTitle from '../UI/list/ElementTitle';
import DetailArea from '../UI/list/DetailArea';

interface JourneyListElementProps {
  journey: Journey;
}

const JourneyListElement: React.FC<JourneyListElementProps> = ({
  journey,
}): ReactElement => {
  const moneyAvailable = formatAmount(journey.costs.available_money);
  const moneyPlanned = formatAmount(journey.costs.planned_costs);
  const startDate = formatDate(journey.scheduled_start_time);
  const endDate = formatDate(journey.scheduled_end_time);
  const durationInDays = formatDurationToDays(
    journey.scheduled_end_time,
    journey.scheduled_start_time
  );

  const elementDetailInfo = [
    { title: 'Duration', value: `${durationInDays} days` },
    { title: 'Costs', value: `${moneyPlanned} / ${moneyAvailable}` },
    { title: 'Start Date', value: startDate },
    { title: 'End Date', value: endDate },
  ];

  const progress = formatProgress(
    journey.scheduled_start_time,
    journey.scheduled_end_time
  );

  const navigation = useNavigation<NavigationProp<StackParamList>>();

  function handleOnPress() {
    navigation.navigate('JourneyBottomTabsNavigator', {
      screen: 'Planning',
      params: { journeyId: journey.id, journeyName: journey.name },
    });
  }

  // TODO: Highlight, when money exceeded
  //TODO: Buttons to edit and delete

  return (
    <View style={styles.outerContainer}>
      <Pressable
        style={({ pressed }) => pressed && styles.pressed}
        android_ripple={{ color: GlobalStyles.colors.primary100 }}
        onPress={handleOnPress}
      >
        <View style={styles.innerContainer}>
          <ElementTitle>{journey.name}</ElementTitle>
          <DetailArea
            elementDetailInfo={elementDetailInfo}
            areaStyle={styles.detailArea}
          />
          <Text style={styles.countriesList}>
            {journey.countries!.join(', ')}
          </Text>
        </View>
        <CustomProgressBar progress={progress} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderColor: GlobalStyles.colors.primary700,
    borderWidth: 2,
    borderRadius: 20,
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    backgroundColor: GlobalStyles.colors.primary50,
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
  countriesList: {
    marginVertical: 8,
    fontStyle: 'italic',
  },
  detailArea: {
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary700,
  },
});

export default JourneyListElement;
