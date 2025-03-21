import {
  ReactElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { View, StyleSheet } from 'react-native';

import { ColorScheme, Icons, JourneyBottomTabsParamsList } from '../../models';
import MajorStageList from '../../components/MajorStage/MajorStageList';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import IconButton from '../../components/UI/IconButton';
import Popup from '../../components/UI/Popup';
import { JourneyContext } from '../../store/journey-context';

interface PlanningProps {
  navigation: NativeStackNavigationProp<
    JourneyBottomTabsParamsList,
    'Planning'
  >;
  route: RouteProp<JourneyBottomTabsParamsList, 'Planning'>;
}

// TODO: Tell user when there are gaps between major stages
// TODO: Hide stages, that are already over (and make visible by button)

const Planning: React.FC<PlanningProps> = ({
  route,
  navigation,
}): ReactElement => {
  const [popupText, setPopupText] = useState<string | null>();
  let { journeyId } = route.params;
  const journeyCtx = useContext(JourneyContext);
  const journeyName = journeyCtx.journeys.find(
    (journey) => journey.id === journeyId
  )?.name;

  useEffect(() => {
    function activatePopup() {
      if (route.params?.popupText) {
        setPopupText(route.params?.popupText);
      }
    }

    activatePopup();
  }, [route.params]);

  function handleClosePopup() {
    setPopupText(null);
  }

  function handleAddMajorStage() {
    navigation.navigate('MajorStageStackNavigator', {
      screen: 'ManageMajorStage',
      params: { journeyId: journeyId },
    });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: journeyName,
      headerRight: () => (
        <IconButton
          icon={Icons.add}
          onPress={handleAddMajorStage}
          color={'white'}
          size={32}
        />
      ),
    });
  }, [navigation, journeyName]);

  return (
    <View style={styles.root}>
      {popupText && (
        <Popup
          content={popupText}
          onClose={handleClosePopup}
          colorScheme={ColorScheme.accent}
        />
      )}
      <MajorStageList journeyId={journeyId!} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default Planning;
