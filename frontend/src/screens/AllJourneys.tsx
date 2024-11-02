import React, { ReactElement, useEffect, useState } from 'react';

import JourneysList from '../components/Journeys/JourneysList';
import { JOURNEYS } from '../dummy_backend/journeys';
import { fetchJourneys } from '../utils/http';

interface AllJourneysProps {}

const AllJourneys: React.FC<AllJourneysProps> = (): ReactElement => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getJourneys() {
      setIsFetching(true);
      try {
        const journeys = await fetchJourneys();
        // TODO: Update context
        setIsFetching(false);
      } catch (error) {
        setError('Could not fetch journeys!');
      }
    }

    getJourneys();
  }, []);

  return <JourneysList journeys={JOURNEYS} />;
};

export default AllJourneys;
