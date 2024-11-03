import { ReactElement } from 'react';
import { FlatList } from 'react-native';

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
      renderItem={({ item }) => <JourneyListElement journey={item} />}
    />
  );
};

export default JourneysList;
