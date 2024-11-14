import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import JourneysList from '../components/Journeys/JourneysList';
import { fetchJourneys } from '../utils/http';
import { Text } from 'react-native';
import { JourneyContext } from '../store/journey-context';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import { BottomTabsParamList } from '../models';

interface AllJourneysProps {
  navigation: NativeStackNavigationProp<BottomTabsParamList, 'AllJourneys'>;
}

const AllJourneys: React.FC<AllJourneysProps> = ({
  navigation,
}): ReactElement => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const journeyCtx = useContext(JourneyContext);

  useEffect(() => {
    async function getJourneys() {
      setIsFetching(true);
      const response = await fetchJourneys();

      if (!response.error) {
        journeyCtx.setJourneys(response.journeys || []);
      } else {
        setError(response.error);
      }
      setIsFetching(false);
    }

    getJourneys();
  }, [refresh]);

  function handlePressReload() {
    setRefresh((prev) => prev + 1);
  }

  if (isFetching) {
    return <Text>Loading...</Text>;
  }

  if (journeyCtx.journeys.length === 0 && !error) {
    return <Text>No journeys found!</Text>;
  }

  if (error) {
    return (
      <ErrorOverlay
        message={error}
        onPress={handlePressReload}
        buttonText='Reload'
      />
    );
  }

  return <JourneysList journeys={journeyCtx.journeys} />;
};

export default AllJourneys;
