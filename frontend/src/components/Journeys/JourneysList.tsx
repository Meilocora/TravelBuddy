import { ReactElement } from 'react';
import { FlatList } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { Journey } from '../../models';
import JourneyListElement from './JourneysListElement';

interface JourneysListProps {
  journeys: Journey[];
}

const JourneysList: React.FC<JourneysListProps> = ({
  journeys,
}): ReactElement => {
  return (
    <FlatList
      data={journeys}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.delay(index * 200).duration(1000)}>
          <JourneyListElement journey={item} />
        </Animated.View>
      )}
    />
  );
};

export default JourneysList;
