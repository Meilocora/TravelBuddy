import React, { ReactElement, useContext, useEffect, useState } from 'react';

import JourneysList from '../components/Journeys/JourneysList';
import { fetchJourneys } from '../utils/http';
import { Text } from 'react-native';
import { JourneyContext } from '../store/journey-context';

interface AllJourneysProps {}

const AllJourneys: React.FC<AllJourneysProps> = (): ReactElement => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const journeyCtx = useContext(JourneyContext);

  useEffect(() => {
    async function getJourneys() {
      setIsFetching(true);
      const response = await fetchJourneys();
      if (!response.error) {
        journeyCtx.setJourneys(response.typedJourneys || []);
      } else {
        setError(response.error);
      }
      setIsFetching(false);
    }

    getJourneys();
  }, []);

  if (isFetching) {
    return <Text>Loading...</Text>;
  }

  if (journeyCtx.journeys.length === 0) {
    return <Text>No journeys found!</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return <JourneysList journeys={journeyCtx.journeys} />;
};

export default AllJourneys;
