import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ReactElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
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
import { fetchMinorStagesById, parseDate } from '../../../utils';
import { MinorStageContext } from '../../../store/minorStage-context';
import InfoText from '../../../components/UI/InfoText';
import ErrorOverlay from '../../../components/UI/ErrorOverlay';

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
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [popupText, setPopupText] = useState<string | null>();
  let { majorStageId, journeyId } = route.params;

  const majorStageCtx = useContext(MajorStageContext);
  const majorStage = majorStageCtx.majorStages.find(
    (majorStage) => majorStage.id === majorStageId
  );

  const isOver = parseDate(majorStage!.scheduled_end_time) < new Date();

  const minorStageCtx = useContext(MinorStageContext);

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

  useEffect(() => {
    async function getMinorStages() {
      setIsFetching(true);
      const response = await fetchMinorStagesById(majorStage!.id);

      if (!response.error) {
        minorStageCtx.setMinorStages(response.minorStages || []);
      } else {
        setError(response.error);
      }
      setIsFetching(false);
    }

    getMinorStages();
  }, [refresh, majorStageId]);

  function handleClosePopup() {
    setPopupText(null);
  }

  function handlePressReload() {
    setError(null);
    setRefresh((prev) => prev + 1);
  }

  function handleAddMinorStage() {
    navigation.navigate('ManageMinorStage', {
      journeyId: journeyId,
      majorStageId: majorStageId,
    });
  }

  useLayoutEffect(() => {
    if (!isOver) {
      navigation.setOptions({
        title: majorStage?.title,
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
              planningNavigation.navigate('Planning', {
                journeyId: journeyId!,
              });
            }}
          />
        ),
        headerStyle: { backgroundColor: GlobalStyles.colors.complementary700 },
      });
    } else {
      navigation.setOptions({
        title: majorStage?.title,
        headerLeft: ({ tintColor }) => (
          <IconButton
            color={tintColor}
            size={24}
            icon={Icons.arrowBack}
            onPress={() => {
              planningNavigation.navigate('Planning', {
                journeyId: journeyId!,
              });
            }}
          />
        ),
        headerStyle: { backgroundColor: GlobalStyles.colors.complementary700 },
      });
    }
  }, [navigation, majorStage]);

  let content;

  if (isFetching) {
    content = <InfoText content='Loading Minor Stages...' />;
  } else if (minorStageCtx.minorStages.length === 0 && !error) {
    content = <InfoText content='No Minor Stages found!' />;
  } else {
    content = (
      <MinorStageList
        majorStage={majorStage!}
        minorStages={minorStageCtx.minorStages}
      />
    );
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
      <ComplementaryGradient />
      <View style={styles.root}>
        {popupText && (
          <Popup
            content={popupText}
            onClose={handleClosePopup}
            colorScheme={ColorScheme.complementary}
          />
        )}
        {content}
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
