import { ReactElement, useState } from 'react';
import { FlatList } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { Journey, StageFilter } from '../../models';
import JourneyListElement from './JourneysListElement';
import { parseDate } from '../../utils';

interface JourneysListProps {
  journeys: Journey[];
}

const JourneysList: React.FC<JourneysListProps> = ({
  journeys,
}): ReactElement => {
  const [filter, setFilter] = useState<StageFilter>(StageFilter.current);

  // Filter journeys based on the filter and current time
  const now = new Date();
  const shownJourneys = journeys.filter((journey) => {
    if (filter === StageFilter.current) {
      return parseDate(journey.scheduled_end_time) >= now; // Only include journeys that haven't ended
    }
    return true; // Include all journeys for other filters
  });

  // TODO: Implement button to also see old journeys
  // TODO: Display old journeys grey'ish
  // TODO: Old journeys should not be editable

  return (
    <FlatList
      data={shownJourneys}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.delay(index * 200).duration(1000)}>
          <JourneyListElement journey={item} />
        </Animated.View>
      )}
    />
  );
};

export default JourneysList;
