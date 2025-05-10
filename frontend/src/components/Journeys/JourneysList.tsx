import { ReactElement, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import {
  ButtonMode,
  ColorScheme,
  Icons,
  Journey,
  StageFilter,
} from '../../models';
import JourneyListElement from './JourneysListElement';
import { parseDate } from '../../utils';
import Button from '../UI/Button';
import IconButton from '../UI/IconButton';
import FilterSettings from '../UI/FilterSettings';

interface JourneysListProps {
  journeys: Journey[];
}

const JourneysList: React.FC<JourneysListProps> = ({
  journeys,
}): ReactElement => {
  const [filter, setFilter] = useState<StageFilter>(StageFilter.current);
  const [openModal, setOpenModal] = useState<boolean>(true);

  // Filter journeys based on the filter and current time
  const now = new Date();
  const currentJourneys = journeys.filter((journey) => {
    return parseDate(journey.scheduled_end_time) >= now; // Only include journeys that haven't ended
  });

  // TODO: Implement button to also see old journeys
  // TODO: Display old journeys grey'ish
  // TODO: Old journeys should not be editable

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <IconButton icon={Icons.settings} onPress={() => {}} />
      </View>
      {openModal && <FilterSettings />}
      <FlatList
        data={currentJourneys}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 200).duration(1000)}
          >
            <JourneyListElement journey={item} />
          </Animated.View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default JourneysList;
