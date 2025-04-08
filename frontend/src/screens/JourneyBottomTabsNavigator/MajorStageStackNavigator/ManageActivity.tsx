import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ReactElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Activity, Icons, MajorStageStackParamList } from '../../../models';
import { RouteProp } from '@react-navigation/native';
import ComplementaryGradient from '../../../components/UI/LinearGradients/ComplementaryGradient';
import { GlobalStyles } from '../../../constants/styles';
import ErrorOverlay from '../../../components/UI/ErrorOverlay';
import Animated, { FadeInDown } from 'react-native-reanimated';
import IconButton from '../../../components/UI/IconButton';
import { MinorStageContext } from '../../../store/minorStage-context';

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
}

const ManageActivity: React.FC<ManageActivityProps> = ({
  route,
  navigation,
}): ReactElement => {
  const [error, setError] = useState<string | null>(null);

  const minorStageCtx = useContext(MinorStageContext);

  const { minorStageId, activityId } = route.params;
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
    link: selectedActivity?.link || '',
  });

  // Redefine minorStageValues, when selectedActivity changes
  useEffect(() => {
    setActivityValues({
      name: selectedActivity?.name || '',
      description: selectedActivity?.description || '',
      costs: selectedActivity?.costs || 0,
      booked: selectedActivity?.booked || false,
      place: selectedActivity?.place || '',
      link: selectedActivity?.link || '',
    });
  }, [selectedActivity]);

  async function deleteHandler() {
    //     try {
    //       const { error, status } = await deleteMinorStage(editedMinorStageId!);
    //       if (!error && status === 200) {
    //         minorStageCtx.deleteMinorStage(editedMinorStageId!);
    //         // Refetch Journeys and MajorStages in case the costs have changed
    //         await majorStageCtx.refetchMajorStages(journeyId);
    //         await journeyCtx.refetchJourneys();
    //         const popupText = `Minor Stage successfully deleted!`;
    //         navigation.navigate('MinorStages', {
    //           journeyId: journeyId,
    //           majorStageId: majorStageId,
    //           popupText: popupText,
    //         });
    //       } else {
    //         setError(error!);
    //         return;
    //       }
    //     } catch (error) {
    //       setError('Could not delete major stage!');
    //     }
    //     setIsDeleting(false);
    //     return;
  }

  function resetValues() {
    setActivityValues({
      name: '',
      description: '',
      costs: 0,
      booked: false,
      place: '',
      link: '',
    });
  }

  // async function confirmHandler({
  //   status,
  //   error,
  //   minorStage,
  // }: ConfirmHandlerProps) {
  //   if (isEditing) {
  //     if (error) {
  //       setError(error);
  //       return;
  //     } else if (minorStage && status === 200) {
  //       await minorStageCtx.refetchMinorStages(editedMinorStageId!);
  //       // Refetch Journeys and MajorStages in case the costs have changed
  //       await majorStageCtx.refetchMajorStages(journeyId);
  //       await journeyCtx.refetchJourneys();
  //       const popupText = `"${minorStage.title}" successfully updated!`;
  //       navigation.navigate('MinorStages', {
  //         journeyId: journeyId,
  //         majorStageId: majorStageId,
  //         popupText: popupText,
  //       });
  //       resetValues();
  //     }
  //   } else {
  //     if (error) {
  //       setError(error);
  //       return;
  //     } else if (minorStage && status === 201) {
  //       await minorStageCtx.refetchMinorStages(editedMinorStageId!);
  //       // Refetch Journeys and MajorStages in case the costs have changed
  //       await majorStageCtx.refetchMajorStages(journeyId);
  //       await journeyCtx.refetchJourneys();
  //       const popupText = `"${minorStage.title}" successfully created!`;
  //       navigation.navigate('MinorStages', {
  //         journeyId: journeyId,
  //         majorStageId: majorStageId,
  //         popupText: popupText,
  //       });
  //       resetValues();
  //     }
  //   }
  // }

  return (
    <View style={styles.root}>
      <ComplementaryGradient />
      {error && <ErrorOverlay message={error} onPress={() => setError(null)} />}
      <Animated.ScrollView entering={FadeInDown} nestedScrollEnabled={true}>
        {/* <MinorStageForm
          onCancel={cancelHandler}
          onSubmit={confirmHandler}
          submitButtonLabel={isEditing ? 'Update' : 'Create'}
          defaultValues={isEditing ? minorStageValues : undefined}
          isEditing={isEditing}
          majorStageId={majorStageId}
          editMinorStageId={editedMinorStageId}
        /> */}
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
