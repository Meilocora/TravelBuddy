import React, {
  ReactElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import SecondaryGradient from '../components/UI/LinearGradients/SecondaryGradient';
import {
  MajorStage,
  StackParamList,
  ManageMajorStageRouteProp,
  MajorStageValues,
  JourneyBottomTabsParamsList,
  Icons,
} from '../models';
import { MajorStageContext } from '../store/majorStage-context.';
import { formatDateString } from '../utils';
import Modal from '../components/UI/Modal';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlobalStyles } from '../constants/styles';
import IconButton from '../components/UI/IconButton';
import MajorStageForm from '../components/MajorStage/ManageMajorStage/MajorStageForm';

interface ManageMajorStageProps {
  route: ManageMajorStageRouteProp;
  navigation: NativeStackNavigationProp<StackParamList, 'ManageMajorStage'>;
}

interface ConfirmHandlerProps {
  error?: string;
  status: number;
  majorStage?: MajorStage;
}

const ManageMajorStage: React.FC<ManageMajorStageProps> = ({
  route,
  navigation,
}): ReactElement => {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const majorStageCtx = useContext(MajorStageContext);
  const editedMajorStageId = route.params?.majorStageId;
  const journeyId = route.params.journeyId;
  let isEditing = !!editedMajorStageId;

  const selectedMajorStage = majorStageCtx.majorStages.find(
    (majorStage) => majorStage.id === editedMajorStageId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      title: isEditing
        ? `Manage ${selectedMajorStage?.title}`
        : 'Add Major Stage',
    });
  }, [navigation]);

  // Empty, when no default values provided
  const [majorStageValues, setMajorStageValues] = useState<MajorStageValues>({
    title: selectedMajorStage?.title || '',
    done: selectedMajorStage?.done || false,
    scheduled_start_time: selectedMajorStage?.scheduled_start_time
      ? formatDateString(selectedMajorStage.scheduled_start_time)
      : null,
    scheduled_end_time: selectedMajorStage?.scheduled_end_time
      ? formatDateString(selectedMajorStage.scheduled_end_time)
      : null,
    additional_info: selectedMajorStage?.additional_info || '',
    available_money: selectedMajorStage?.costs.available_money || 0,
    planned_costs: selectedMajorStage?.costs.planned_costs || 0,
    country: selectedMajorStage?.country || '',
  });

  useFocusEffect(
    useCallback(() => {
      // MajorStageValues set, when screen is focused
      setMajorStageValues({
        title: selectedMajorStage?.title || '',
        done: selectedMajorStage?.done || false,
        scheduled_start_time: selectedMajorStage?.scheduled_start_time
          ? formatDateString(selectedMajorStage.scheduled_start_time)
          : null,
        scheduled_end_time: selectedMajorStage?.scheduled_end_time
          ? formatDateString(selectedMajorStage.scheduled_end_time)
          : null,
        additional_info: selectedMajorStage?.additional_info || '',
        available_money: selectedMajorStage?.costs.available_money || 0,
        planned_costs: selectedMajorStage?.costs.planned_costs || 0,
        country: selectedMajorStage?.country || '',
      });

      return () => {
        // Clean up function, when screen is unfocused
        // reset MajorStageValues
        setMajorStageValues({
          title: '',
          done: false,
          scheduled_start_time: null,
          scheduled_end_time: null,
          additional_info: '',
          available_money: 0,
          planned_costs: 0,
          country: '',
        });
        // reset majorStageId in navigation params for BottomTab
        navigation.setParams({ majorStageId: undefined });
      };
    }, [])
  );

  async function deleteMajorStageHandler() {
    // try {
    // const { error, status } = await deleteJourney(editedJourneyId!);
    // if (!error && status === 200) {
    // journeyCtx.deleteJourney(editedJourneyId!);
    // const popupText = 'Journey successfully deleted!';
    // navigation.navigate('AllJourneys', { popupText: popupText });
    // } else {
    // setError(error!);
    // return;
    // }
    // } catch (error) {
    // setError('Could not delete journey!');
    // }
    setIsDeleting(false);
    return;
  }

  function deleteHandler() {
    setIsDeleting(true);
  }

  function closeModalHandler() {
    setIsDeleting(false);
  }

  function cancelHandler() {
    navigation.goBack();
  }

  function confirmHandler({ status, error, majorStage }: ConfirmHandlerProps) {
    if (isEditing) {
      if (error) {
        setError(error);
        return;
      } else if (majorStage && status === 200) {
        majorStageCtx.updateMajorStage(majorStage);
        const popupText = 'Major Stage successfully updated!';
        // navigation.navigate('AllJourneys', { popupText: popupText });
        navigation.goBack();
      }
    } else {
      if (error) {
        setError(error);
        return;
      } else if (majorStage && status === 201) {
        majorStageCtx.addMajorStage(majorStage);
        const popupText = 'Major Stage successfully created!';
        // navigation.navigate('AllJourneys', { popupText: popupText });
        navigation.goBack();
      }
    }
  }

  return (
    <View style={styles.root}>
      <SecondaryGradient />
      {isDeleting && (
        <Modal
          title='Are you sure?'
          content={`If you delete ${majorStageValues.title}, all related Major and Minor Stages will also be deleted permanently`}
          onConfirm={deleteMajorStageHandler}
          onCancel={closeModalHandler}
        />
      )}
      {error && <ErrorOverlay message={error} onPress={() => setError(null)} />}
      <Animated.ScrollView entering={FadeInDown}>
        <MajorStageForm
          onCancel={cancelHandler}
          onSubmit={confirmHandler}
          submitButtonLabel={isEditing ? 'Update' : 'Add'}
          defaultValues={isEditing ? majorStageValues : undefined}
          isEditing={isEditing}
          editMajorStageId={editedMajorStageId}
          journeyId={journeyId}
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

export default ManageMajorStage;
