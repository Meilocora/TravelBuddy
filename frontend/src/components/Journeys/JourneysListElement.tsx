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
import ElementDetail from './ElementDetail';
import CustomProgressBar from '../UI/CustomProgressBar';
import { StackParamList } from '../../models';

interface JourneyListElementProps {
  journey: Journey;
}

// TODO: map over list to generate ElemenetDetail components

const JourneyListElement: React.FC<JourneyListElementProps> = ({
  journey,
}): ReactElement => {
  const costs = formatAmount(journey.costs.available_money);
  const startDate = formatDate(journey.scheduled_start_time);
  const endDate = formatDate(journey.scheduled_end_time);
  const durationInDays = formatDurationToDays(
    journey.scheduled_end_time,
    journey.scheduled_start_time
  );
  const progress = formatProgress(
    journey.scheduled_start_time,
    journey.scheduled_end_time
  );

  const navigation = useNavigation<NavigationProp<StackParamList>>();
  function handleOnPress() {
    navigation.navigate('Planning', { journeyId: journey.id });
  }

  return (
    <View style={styles.outerContainer}>
      <Pressable
        style={({ pressed }) => pressed && styles.pressed}
        android_ripple={{ color: GlobalStyles.colors.primary100 }}
        onPress={handleOnPress}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{journey.name}</Text>
          <View style={styles.detailsContainer}>
            <ElementDetail
              title='Costs'
              value={costs}
              style={styles.elementDetail}
            />
            <ElementDetail
              title='Duration'
              value={`${durationInDays} days`}
              style={styles.elementDetail}
            />
            <ElementDetail
              title='Start Date'
              value={startDate}
              style={styles.elementDetail}
            />
            <ElementDetail
              title='End Date'
              value={endDate}
              style={styles.elementDetail}
            />
          </View>
          <Text style={styles.countriesList}>
            {journey.countries.join(', ')}
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
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary700,
    marginVertical: 8,
    paddingTop: 6,
    width: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  elementDetail: {
    flexBasis: '50%', // max. 2 ElementDetails in a row
  },
  countriesList: {
    marginVertical: 8,
    fontStyle: 'italic',
  },
});

export default JourneyListElement;
