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
    accommodation_name: selectedMinorStage?.accommodation.name || '',
    accommodation_place: selectedMinorStage?.accommodation.place || '',
    accommodation_costs: selectedMinorStage?.accommodation.costs || 0,
    accommodation_booked: selectedMinorStage?.accommodation.booked || false,
    accommodation_link: selectedMinorStage?.accommodation.link || '',
    accommodation_maps_link: selectedMinorStage?.accommodation.maps_link || '',
    placesToVisist: selectedMinorStage?.placesToVisit || '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: GlobalStyles.colors.complementary700 },
      headerTitleAlign: 'center',
      title: isEditing
        ? `Manage "${selectedMinorStage?.title}"`
        : 'Add Minor Stage',
      // headerLeft: ({ tintColor }) => (
      //   <IconButton
      //     color={tintColor}
      //     size={24}
      //     icon={Icons.arrowBack}
      //     onPress={() => {
      //       planningNavigation.navigate('Planning', { journeyId: journeyId });
      //     }}
      //   />
      // ),
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
      accommodation_name: selectedMinorStage?.accommodation.name || '',
      accommodation_place: selectedMinorStage?.accommodation.place || '',
      accommodation_costs: selectedMinorStage?.accommodation.costs || 0,
      accommodation_booked: selectedMinorStage?.accommodation.booked || false,
      accommodation_link: selectedMinorStage?.accommodation.link || '',
      accommodation_maps_link:
        selectedMinorStage?.accommodation.maps_link || '',
      placesToVisist: selectedMinorStage?.placesToVisit || '',
    });
  }, [selectedMinorStage]);

  async function deleteMinorStageHandler() {
    try {
      const { error, status } = await deleteMinorStage(editedMinorStageId!);
      if (!error && status === 200) {
        minorStageCtx.deleteMinorStage(editedMinorStageId!);
        await journeyCtx.refetchJourneys();
        //         const popupText = `Major Stage successfully deleted!`;
        //         planningNavigation.navigate('Planning', {
        //           journeyId: journeyId,
        //           popupText: popupText,
        //         });
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
      accommodation_name: '',
      accommodation_place: '',
      accommodation_costs: 0,
      accommodation_booked: false,
      accommodation_link: '',
      accommodation_maps_link: '',
      placesToVisist: '',
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

  //   function confirmHandler({ status, error, majorStage }: ConfirmHandlerProps) {
  //     if (isEditing) {
  //       if (error) {
  //         setError(error);
  //         return;
  //       } else if (majorStage && status === 200) {
  //         majorStageCtx.updateMajorStage(majorStage);
  //         resetValues();
  //         const popupText = `"${majorStage.title}" successfully updated!`;
  //         planningNavigation.navigate('Planning', {
  //           journeyId: journeyId,
  //           popupText: popupText,
  //         });
  //       }
  //     } else {
  //       if (error) {
  //         setError(error);
  //         return;
  //       } else if (majorStage && status === 201) {
  //         majorStageCtx.addMajorStage(majorStage);
  //         resetValues();
  //         const popupText = `"${majorStage.title}" successfully created!`;
  //         planningNavigation.navigate('Planning', {
  //           journeyId: journeyId,
  //           popupText: popupText,
  //         });
  //       }
  //     }
  //   }

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
          onSubmit={() => {}}
          submitButtonLabel={isEditing ? 'Update' : 'Create'}
          defaultValues={isEditing ? minorStageValues : undefined}
          isEditing={isEditing}
          journeyId={journeyId}
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
