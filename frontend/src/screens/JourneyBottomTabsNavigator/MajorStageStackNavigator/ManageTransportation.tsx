import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ReactElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  Icons,
  JourneyBottomTabsParamsList,
  MajorStageStackParamList,
  Transportation,
} from '../../../models';
import IconButton from '../../../components/UI/IconButton';
import TransportationForm from '../../../components/Transportation/TransportationForm';
import { deleteTransportation } from '../../../utils/http';
import { GlobalStyles } from '../../../constants/styles';
import ComplementaryGradient from '../../../components/UI/LinearGradients/ComplementaryGradient';
import ErrorOverlay from '../../../components/UI/ErrorOverlay';
import { StagesContext } from '../../../store/stages-context';
import HeaderTitle from '../../../components/UI/HeaderTitle';

interface ManageTransportationProps {
  navigation: NativeStackNavigationProp<
    MajorStageStackParamList,
    'ManageTransportation'
  >;
  route: RouteProp<MajorStageStackParamList, 'ManageTransportation'>;
}

interface ConfirmHandlerProps {
  error?: string;
  status: number;
  transportation?: Transportation;
  backendMajorStageId?: number;
  mode?: 'major' | 'minor';
}

const ManageTransportation: React.FC<ManageTransportationProps> = ({
  route,
  navigation,
}): ReactElement => {
  const [error, setError] = useState<string | null>(null);
  const [selectedTransportation, setSelectedTransportation] = useState<
    Transportation | undefined
  >(undefined);

  const planningNavigation =
    useNavigation<BottomTabNavigationProp<JourneyBottomTabsParamsList>>();

  const stagesCtx = useContext(StagesContext);

  let { journeyId, majorStageId, minorStageId, transportationId } =
    route.params;
  let isEditing = !!transportationId;

  useFocusEffect(
    useCallback(() => {
      // selectedTransportation set, when screen is focused
      if (minorStageId) {
        setSelectedTransportation(
          stagesCtx.findMinorStage(minorStageId)?.transportation
        );
      } else if (majorStageId) {
        setSelectedTransportation(
          stagesCtx.findMajorStage(majorStageId)?.transportation
        );
      }

      return () => {
        // Clean up function, when screen is unfocused
        setSelectedTransportation(undefined);
      };
    }, [selectedTransportation])
  );

  useLayoutEffect(() => {
    planningNavigation.setOptions({
      headerStyle:
        majorStageId !== undefined
          ? { backgroundColor: GlobalStyles.colors.accent700 }
          : { backgroundColor: GlobalStyles.colors.complementary700 },
      headerTitle: () => (
        <HeaderTitle
          title={isEditing ? `Manage Transportation` : 'Add Transportation'}
        />
      ),
      headerLeft: ({ tintColor }) => (
        <IconButton
          color={tintColor}
          size={24}
          icon={Icons.arrowBack}
          onPress={() => {
            if (majorStageId !== undefined) {
              planningNavigation.navigate('Planning', {
                journeyId: journeyId!,
              });
            } else {
              navigation.goBack();
            }
          }}
        />
      ),
    });
  }, [navigation, selectedTransportation]);

  async function deleteHandler() {
    try {
      const { error, status, backendMajorStageId } = await deleteTransportation(
        majorStageId!,
        minorStageId!
      );
      if (!error && status === 200) {
        if (majorStageId) {
          stagesCtx.fetchUserData();
          const popupText = `Transportation successfully deleted!`;
          planningNavigation.navigate('Planning', {
            journeyId: journeyId!,
            popupText: popupText,
          });
        } else if (minorStageId) {
          stagesCtx.fetchUserData();
          const popupText = `Transportation successfully deleted!`;
          navigation.navigate('MinorStages', {
            journeyId: journeyId!,
            majorStageId: backendMajorStageId!,
            popupText: popupText,
          });
        }
      } else {
        setError(error!);
        return;
      }
    } catch (error) {
      setError('Could not delete transportation!');
    }
    return;
  }

  function cancelHandler() {
    planningNavigation.navigate('Planning', { journeyId: journeyId! });
  }

  async function confirmHandler({
    status,
    error,
    transportation,
    backendMajorStageId,
    mode,
  }: ConfirmHandlerProps) {
    if (error) {
      setError(error);
      return;
    } else if (
      (transportation && status === 200) ||
      (transportation && status === 201)
    ) {
      if (mode === 'major') {
        stagesCtx.fetchUserData();
        const majorStageTitle = stagesCtx.findMajorStage(majorStageId!)?.title;
        const popupText = `"${majorStageTitle}" successfully updated!`;
        planningNavigation.navigate('Planning', {
          journeyId: journeyId!,
          popupText: popupText,
        });
      } else if (mode === 'minor') {
        stagesCtx.fetchUserData();
        const minorStage = stagesCtx.findMinorStage(minorStageId!);
        const popupText = `"${minorStage!.title}" successfully updated!`;
        navigation.navigate('MinorStages', {
          journeyId: journeyId!,
          majorStageId: backendMajorStageId!,
          popupText: popupText,
        });
      }
    }
  }

  return (
    <>
      {error && <ErrorOverlay message={error} onPress={() => setError(null)} />}
      {minorStageId !== undefined && <ComplementaryGradient />}
      <View style={styles.root}>
        <Animated.ScrollView entering={FadeInDown}>
          <TransportationForm
            onCancel={cancelHandler}
            onSubmit={confirmHandler}
            submitButtonLabel={isEditing ? 'Update' : 'Add'}
            defaultValues={isEditing ? selectedTransportation : undefined}
            isEditing={isEditing}
            majorStageId={majorStageId!}
            minorStageId={minorStageId!}
          />
          {isEditing && (
            <View style={styles.btnContainer}>
              <IconButton
                icon={Icons.delete}
                color={GlobalStyles.colors.error200}
                onPress={deleteHandler}
                size={36}
              />
            </View>
          )}
        </Animated.ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  btnContainer: {
    alignItems: 'center',
    marginTop: 18,
  },
});

export default ManageTransportation;
