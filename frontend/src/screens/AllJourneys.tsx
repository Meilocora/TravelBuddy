import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import JourneysList from '../components/Journeys/JourneysList';
import { fetchJourneys } from '../utils/http';
import { StyleSheet } from 'react-native';
import { JourneyContext } from '../store/journey-context';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import { BottomTabsParamList } from '../models';
import { RouteProp } from '@react-navigation/native';
import Popup from '../components/UI/Popup';
import InfoText from '../components/UI/InfoText';

interface AllJourneysProps {
  navigation: NativeStackNavigationProp<BottomTabsParamList, 'AllJourneys'>;
  route: RouteProp<BottomTabsParamList, 'AllJourneys'>;
}

const AllJourneys: React.FC<AllJourneysProps> = ({
  navigation,
  route,
}): ReactElement => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [popupText, setPopupText] = useState<string | null>();

  useEffect(() => {
    function activatePopup() {
      if (route.params?.popupText) {
        setPopupText(route.params?.popupText);
      }
    }

    activatePopup();
  }, [route.params]);

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

  function handleClosePopup() {
    setPopupText(null);
  }

  function handlePressReload() {
    setRefresh((prev) => prev + 1);
  }

  if (isFetching) {
    return <InfoText content='Loading Journeys...' />;
  }

  if (journeyCtx.journeys.length === 0 && !error) {
    return <InfoText content='No Journeys found!' />;
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

  return (
    <>
      {popupText && <Popup content={popupText} onClose={handleClosePopup} />}
      <JourneysList journeys={journeyCtx.journeys} />
    </>
  );
};

const styles = StyleSheet.create({});

export default AllJourneys;
