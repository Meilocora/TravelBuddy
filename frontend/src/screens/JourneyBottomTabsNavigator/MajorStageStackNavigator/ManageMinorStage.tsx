import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ReactElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  Icons,
  MajorStageStackParamList,
  MinorStage,
  MinorStageValues,
} from '../../../models';
import { RouteProp } from '@react-navigation/native';
import ComplementaryGradient from '../../../components/UI/LinearGradients/ComplementaryGradient';
import { GlobalStyles } from '../../../constants/styles';
import { MajorStageContext } from '../../../store/majorStage-context.';
import { MinorStageContext } from '../../../store/minorStage-context';
import { deleteMinorStage, formatDateString } from '../../../utils';
import { JourneyContext } from '../../../store/journey-context';
import Modal from '../../../components/UI/Modal';
import ErrorOverlay from '../../../components/UI/ErrorOverlay';
import IconButton from '../../../components/UI/IconButton';
import MinorStageForm from '../../../components/MinorStage/ManageMinorStage/MinorStageForm';

interface ManageMinorStageProps {
  navigation: NativeStackNavigationProp<
    MajorStageStackParamList,
    'ManageMinorStage'
  >;
  route: RouteProp<MajorStageStackParamList, 'ManageMinorStage'>;
}

interface ConfirmHandlerProps {
  error?: string;
  status: number;
  minorStage?: MinorStage;
}

const ManageMinorStage: React.FC<ManageMinorStageProps> = ({
  route,
  navigation,
}): ReactElement => {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const journeyCtx = useContext(JourneyContext);
  const majorStageCtx = useContext(MajorStageContext);
  const minorStageCtx = useContext(MinorStageContext);
  const {
    journeyId,
    majorStageId,
    minorStageId: editedMinorStageId,
  } = route.params;
  let isEditing = !!editedMinorStageId;

  const selectedMinorStage = minorStageCtx.minorStages.find(
    (minorStage) => minorStage.id === editedMinorStageId
  );

  // Empty, when no default values provided
  const [minorStageValues, setMinorStageValues] = useState<MinorStageValues>({
    title: selectedMinorStage?.title || '',
    done: selectedMinorStage?.done || false,
    scheduled_start_time: selectedMinorStage?.scheduled_start_time
      ? formatDateString(selectedMinorStage.scheduled_start_time)
      : null,
    scheduled_end_time: selectedMinorStage?.scheduled_end_time
      ? formatDateString(selectedMinorStage.scheduled_end_time)
      : null,
    budget: selectedMinorStage?.costs.budget || 0,
    spent_money: selectedMinorStage?.costs.spent_money || 0,
    accommodation_place: selectedMinorStage?.accommodation.place || '',
    accommodation_costs: selectedMinorStage?.accommodation.costs || 0,
    accommodation_booked: selectedMinorStage?.accommodation.booked || false,
    accommodation_link: selectedMinorStage?.accommodation.link || '',
    accommodation_maps_link: selectedMinorStage?.accommodation.maps_link || '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: GlobalStyles.colors.complementary700 },
      headerTitleAlign: 'center',
      title: isEditing
        ? `Manage "${selectedMinorStage?.title}"`
        : 'Add Minor Stage',
    });
  }, [navigation, isEditing]);

  // Redefine minorStageValues, when selectedMinorStage changes
  useEffect(() => {
    setMinorStageValues({
      title: selectedMinorStage?.title || '',
      done: selectedMinorStage?.done || false,
      scheduled_start_time: selectedMinorStage?.scheduled_start_time
        ? formatDateString(selectedMinorStage.scheduled_start_time)
        : null,
      scheduled_end_time: selectedMinorStage?.scheduled_end_time
        ? formatDateString(selectedMinorStage.scheduled_end_time)
        : null,
      budget: selectedMinorStage?.costs.budget || 0,
      spent_money: selectedMinorStage?.costs.spent_money || 0,
      accommodation_place: selectedMinorStage?.accommodation.place || '',
      accommodation_costs: selectedMinorStage?.accommodation.costs || 0,
      accommodation_booked: selectedMinorStage?.accommodation.booked || false,
      accommodation_link: selectedMinorStage?.accommodation.link || '',
      accommodation_maps_link:
        selectedMinorStage?.accommodation.maps_link || '',
    });
  }, [selectedMinorStage]);

  async function deleteMinorStageHandler() {
    try {
      const { error, status } = await deleteMinorStage(editedMinorStageId!);
      if (!error && status === 200) {
        minorStageCtx.deleteMinorStage(editedMinorStageId!);
        // Refetch Journeys and MajorStages in case the costs have changed
        await majorStageCtx.refetchMajorStages(journeyId);
        await journeyCtx.refetchJourneys();
        const popupText = `Minor Stage successfully deleted!`;
        navigation.navigate('MinorStages', {
          journeyId: journeyId,
          majorStageId: majorStageId,
          popupText: popupText,
        });
      } else {
        setError(error!);
        return;
      }
    } catch (error) {
      setError('Could not delete major stage!');
    }
    setIsDeleting(false);
    return;
  }

  function resetValues() {
    setMinorStageValues({
      title: '',
      done: false,
      scheduled_start_time: null,
      scheduled_end_time: null,
      budget: 0,
      spent_money: 0,
      accommodation_place: '',
      accommodation_costs: 0,
      accommodation_booked: false,
      accommodation_link: '',
      accommodation_maps_link: '',
    });
  }

  function deleteHandler() {
    setIsDeleting(true);
  }

  function closeModalHandler() {
    setIsDeleting(false);
  }

  function cancelHandler() {
    //     planningNavigation.navigate('Planning', { journeyId: journeyId });
    navigation.goBack();
  }

  async function confirmHandler({
    status,
    error,
    minorStage,
  }: ConfirmHandlerProps) {
    if (isEditing) {
      if (error) {
        setError(error);
        return;
      } else if (minorStage && status === 200) {
        await minorStageCtx.refetchMinorStages(editedMinorStageId!);
        // Refetch Journeys and MajorStages in case the costs have changed
        await majorStageCtx.refetchMajorStages(journeyId);
        await journeyCtx.refetchJourneys();
        const popupText = `"${minorStage.title}" successfully updated!`;
        navigation.navigate('MinorStages', {
          journeyId: journeyId,
          majorStageId: majorStageId,
          popupText: popupText,
        });
        resetValues();
      }
    } else {
      if (error) {
        setError(error);
        return;
      } else if (minorStage && status === 201) {
        await minorStageCtx.refetchMinorStages(editedMinorStageId!);
        // Refetch Journeys and MajorStages in case the costs have changed
        await majorStageCtx.refetchMajorStages(journeyId);
        await journeyCtx.refetchJourneys();
        const popupText = `"${minorStage.title}" successfully created!`;
        navigation.navigate('MinorStages', {
          journeyId: journeyId,
          majorStageId: majorStageId,
          popupText: popupText,
        });
        resetValues();
      }
    }
  }

  return (
    <View style={styles.root}>
      <ComplementaryGradient />
      {isDeleting && (
        <Modal
          title='Are you sure?'
          content={`If you delete ${minorStageValues.title}, all related Activities and Spendings will also be deleted permanently`}
          onConfirm={deleteMinorStageHandler}
          onCancel={closeModalHandler}
        />
      )}
      {error && <ErrorOverlay message={error} onPress={() => setError(null)} />}
      <Animated.ScrollView entering={FadeInDown} nestedScrollEnabled={true}>
        <MinorStageForm
          onCancel={cancelHandler}
          onSubmit={confirmHandler}
          submitButtonLabel={isEditing ? 'Update' : 'Create'}
          defaultValues={isEditing ? minorStageValues : undefined}
          isEditing={isEditing}
          majorStageId={majorStageId}
          editMinorStageId={editedMinorStageId}
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

export default ManageMinorStage;
