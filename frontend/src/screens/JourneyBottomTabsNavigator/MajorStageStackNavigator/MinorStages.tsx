import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ReactElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';

import {
  ColorScheme,
  Icons,
  JourneyBottomTabsParamsList,
  MajorStageStackParamList,
} from '../../../models';
import IconButton from '../../../components/UI/IconButton';
import Popup from '../../../components/UI/Popup';
import ComplementaryGradient from '../../../components/UI/LinearGradients/ComplementaryGradient';
import { GlobalStyles } from '../../../constants/styles';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MajorStageContext } from '../../../store/majorStage-context.';
import MinorStageList from '../../../components/MinorStage/MinorStageList';

interface MinorStagesProps {
  navigation: NativeStackNavigationProp<
    MajorStageStackParamList,
    'MinorStages'
  >;
  route: RouteProp<MajorStageStackParamList, 'MinorStages'>;
}

const MinorStages: React.FC<MinorStagesProps> = ({
  route,
  navigation,
}): ReactElement => {
  const [popupText, setPopupText] = useState<string | null>();
  let { majorStageId, journeyId } = route.params;

  const majorStageCtx = useContext(MajorStageContext);
  const majorStageTitle = majorStageCtx.majorStages.find(
    (majorStage) => majorStage.id === majorStageId
  )?.title;

  const planningNavigation =
    useNavigation<BottomTabNavigationProp<JourneyBottomTabsParamsList>>();

  // Hide tab bar when navigating to this screen
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none',
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

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

  function handleAddMinorStage() {
    navigation.navigate('ManageMinorStage', {
      journeyId: journeyId,
      majorStageId: majorStageId,
    });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: majorStageTitle,
      headerRight: () => (
        <IconButton
          icon={Icons.add}
          onPress={handleAddMinorStage}
          color={'white'}
          size={32}
        />
      ),
      headerLeft: ({ tintColor }) => (
        <IconButton
          color={tintColor}
          size={24}
          icon={Icons.arrowBack}
          onPress={() => {
            planningNavigation.navigate('Planning', { journeyId: journeyId! });
          }}
        />
      ),
      headerStyle: { backgroundColor: GlobalStyles.colors.complementary700 },
    });
  }, [navigation, majorStageTitle]);

  return (
    <>
      <ComplementaryGradient />
      <View style={styles.root}>
        {popupText && (
          <Popup
            content={popupText}
            onClose={handleClosePopup}
            colorScheme={ColorScheme.complementary}
          />
        )}
        <MinorStageList majorStageId={majorStageId} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default MinorStages;
