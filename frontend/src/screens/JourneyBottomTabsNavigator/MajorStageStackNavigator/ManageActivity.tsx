import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ReactElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { Activity, Icons, MajorStageStackParamList } from '../../../models';
import { RouteProp } from '@react-navigation/native';
import ComplementaryGradient from '../../../components/UI/LinearGradients/ComplementaryGradient';
import { GlobalStyles } from '../../../constants/styles';
import ErrorOverlay from '../../../components/UI/ErrorOverlay';
import Animated, { FadeInDown } from 'react-native-reanimated';
import IconButton from '../../../components/UI/IconButton';
import { MinorStageContext } from '../../../store/minorStage-context';
import ActivityForm from '../../../components/MinorStage/ManageActivity/ActivityForm';
import { MajorStageContext } from '../../../store/majorStage-context.';
import { JourneyContext } from '../../../store/journey-context';
import { deleteActivity } from '../../../utils/http';

interface ManageActivityProps {
  navigation: NativeStackNavigationProp<
    MajorStageStackParamList,
    'ManageActivity'
  >;
  route: RouteProp<MajorStageStackParamList, 'ManageActivity'>;
}

interface ConfirmHandlerProps {
  error?: string;
  status: number;
  activity?: Activity;
  backendJourneyId?: number;
}

const ManageActivity: React.FC<ManageActivityProps> = ({
  route,
  navigation,
}): ReactElement => {
  const [error, setError] = useState<string | null>(null);

  const minorStageCtx = useContext(MinorStageContext);
  const majorStageCtx = useContext(MajorStageContext);
  const journeyCtx = useContext(JourneyContext);

  const { minorStageId, activityId, majorStageId } = route.params;
  const isEditing = !!activityId;

  let selectedActivity: Activity | undefined;

  if (activityId) {
    selectedActivity = minorStageCtx.minorStages
      .find((minorStage) => minorStage.id === minorStageId)!
      .activities!.find((activity) => activity.id === activityId);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: isEditing ? 'Edit Activity' : 'Add Activity',
      headerStyle: { backgroundColor: GlobalStyles.colors.complementary700 },
    });
  }, [navigation]);

  // Empty, when no default values provided
  const [activityValues, setActivityValues] = useState<Activity>({
    name: selectedActivity?.name || '',
    description: selectedActivity?.description || '',
    costs: selectedActivity?.costs || 0,
    booked: selectedActivity?.booked || false,
    place: selectedActivity?.place || '',
    latitude: selectedActivity?.latitude || undefined,
    longitude: selectedActivity?.longitude || undefined,
    link: selectedActivity?.link || '',
  });

  // Redefine activityValues, when selectedActivity changes
  useEffect(() => {
    setActivityValues({
      name: selectedActivity?.name || '',
      description: selectedActivity?.description || '',
      costs: selectedActivity?.costs || 0,
      booked: selectedActivity?.booked || false,
      place: selectedActivity?.place || '',
      latitude: selectedActivity?.latitude || undefined,
      longitude: selectedActivity?.longitude || undefined,
      link: selectedActivity?.link || '',
    });
  }, [selectedActivity]);

  async function deleteHandler() {
    try {
      const { error, status, backendJourneyId } = await deleteActivity(
        activityId!
      );
      if (!error && status === 200) {
        await minorStageCtx.refetchMinorStages(minorStageId);
        // Refetch Journeys and MajorStages in case the costs have changed
        await majorStageCtx.refetchMajorStages(backendJourneyId!);
        await journeyCtx.refetchJourneys();
        navigation.goBack();
      } else {
        setError(error!);
        return;
      }
    } catch (error) {
      setError('Could not delete activity!');
    }
  }

  function resetValues() {
    setActivityValues({
      name: '',
      description: '',
      costs: 0,
      booked: false,
      place: '',
      latitude: undefined,
      longitude: undefined,
      link: '',
    });
  }

  async function confirmHandler({
    status,
    error,
    activity,
    backendJourneyId,
  }: ConfirmHandlerProps) {
    if (isEditing) {
      if (error) {
        setError(error);
        return;
      } else if (activity && status === 200) {
        await minorStageCtx.refetchMinorStages(majorStageId);
        // Refetch Journeys and MajorStages in case the costs have changed
        await majorStageCtx.refetchMajorStages(backendJourneyId!);
        await journeyCtx.refetchJourneys();
        navigation.goBack();
        resetValues();
      }
    } else {
      if (error) {
        setError(error);
        return;
      } else if (activity && status === 201) {
        await minorStageCtx.refetchMinorStages(majorStageId);
        // Refetch Journeys and MajorStages in case the costs have changed
        await majorStageCtx.refetchMajorStages(backendJourneyId!);
        await journeyCtx.refetchJourneys();
        navigation.goBack();
        resetValues();
      }
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  return (
    <View style={styles.root}>
      <ComplementaryGradient />
      {error && <ErrorOverlay message={error} onPress={() => setError(null)} />}
      <Animated.ScrollView entering={FadeInDown} nestedScrollEnabled={true}>
        <ActivityForm
          minorStageId={minorStageId}
          onCancel={cancelHandler}
          onSubmit={confirmHandler}
          submitButtonLabel={isEditing ? 'Update' : 'Add'}
          defaultValues={isEditing ? activityValues : undefined}
          editActivityId={activityId}
          isEditing={isEditing}
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

export default ManageActivity;
