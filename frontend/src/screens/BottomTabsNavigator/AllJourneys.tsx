import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import JourneysList from '../../components/Journeys/JourneysList';
import { fetchJourneys } from '../../utils/http';
import { StyleSheet } from 'react-native';
import { JourneyContext } from '../../store/journey-context';
import ErrorOverlay from '../../components/UI/ErrorOverlay';
import { BottomTabsParamList } from '../../models';
import { RouteProp } from '@react-navigation/native';
import Popup from '../../components/UI/Popup';
import InfoText from '../../components/UI/InfoText';
import { AuthContext } from '../../store/auth-context';

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

  const authCtx = useContext(AuthContext);
  const journeyCtx = useContext(JourneyContext);

  useEffect(() => {
    function activatePopup() {
      if (route.params?.popupText) {
        setPopupText(route.params?.popupText);
      }
    }

    activatePopup();
  }, [route.params]);

  useEffect(() => {
    function activatePopup() {
      if (authCtx.username) {
        setPopupText(`Welcome ${authCtx.username}!`);
      }
    }

    activatePopup();
  }, [authCtx]);

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
    setError(null);
    setRefresh((prev) => prev + 1);
  }

  let content;

  if (isFetching) {
    content = <InfoText content='Loading Journeys...' />;
  } else if (journeyCtx.journeys.length === 0 && !error) {
    content = <InfoText content='No Journeys found!' />;
  } else {
    content = <JourneysList journeys={journeyCtx.journeys} />;
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
    <View style={styles.root}>
      {popupText && <Popup content={popupText} onClose={handleClosePopup} />}
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default AllJourneys;
