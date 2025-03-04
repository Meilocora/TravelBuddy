import React, {
  ReactElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  MajorStage,
  MajorStageValues,
  JourneyBottomTabsParamsList,
  Icons,
  MajorStageStackParamList,
} from '../models';
import { MajorStageContext } from '../store/majorStage-context.';
import { formatDateString } from '../utils';
import Modal from '../components/UI/Modal';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import { GlobalStyles } from '../constants/styles';
import IconButton from '../components/UI/IconButton';
import MajorStageForm from '../components/MajorStage/ManageMajorStage/MajorStageForm';
import { deleteMajorStage } from '../utils/http';

interface ManageMajorStageProps {
  navigation: NativeStackNavigationProp<
    MajorStageStackParamList,
    'ManageMajorStage'
  >;
  route: RouteProp<MajorStageStackParamList, 'ManageMajorStage'>;
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

  const planningNavigation =
    useNavigation<BottomTabNavigationProp<JourneyBottomTabsParamsList>>();

  const majorStageCtx = useContext(MajorStageContext);
  const editedMajorStageId = route.params?.majorStageId;
  const journeyId = route.params.journeyId;
  let isEditing = !!editedMajorStageId;

  const selectedMajorStage = majorStageCtx.majorStages.find(
    (majorStage) => majorStage.id === editedMajorStageId
  );

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
    budget: selectedMajorStage?.costs.budget || 0,
    spent_money: selectedMajorStage?.costs.spent_money || 0,
    country: selectedMajorStage?.country || '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      title: isEditing
        ? `Manage "${selectedMajorStage?.title}"`
        : 'Add Major Stage',
      headerLeft: ({ tintColor }) => (
        <IconButton
          color={tintColor}
          size={24}
          icon={Icons.arrowBack}
          onPress={() => {
            planningNavigation.navigate('Planning', { journeyId: journeyId });
          }}
        />
      ),
    });
  }, [navigation, isEditing]);

  // Redefine majorStageValues, when selectedMajorStage changes
  useEffect(() => {
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
      budget: selectedMajorStage?.costs.budget || 0,
      spent_money: selectedMajorStage?.costs.spent_money || 0,
      country: selectedMajorStage?.country || '',
    });
  }, [selectedMajorStage]);

  async function deleteMajorStageHandler() {
    try {
      const { error, status } = await deleteMajorStage(editedMajorStageId!);
      if (!error && status === 200) {
        majorStageCtx.deleteMajorStage(editedMajorStageId!);
        const popupText = `Major Stage successfully deleted!`;
        planningNavigation.navigate('Planning', {
          journeyId: journeyId,
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

  function deleteHandler() {
    setIsDeleting(true);
  }

  function closeModalHandler() {
    setIsDeleting(false);
  }

  function cancelHandler() {
    planningNavigation.navigate('Planning', { journeyId: journeyId });
  }

  function confirmHandler({ status, error, majorStage }: ConfirmHandlerProps) {
    if (isEditing) {
      if (error) {
        setError(error);
        return;
      } else if (majorStage && status === 200) {
        majorStageCtx.updateMajorStage(majorStage);
        const popupText = `Major Stage "${majorStage.title}" successfully updated!`;
        planningNavigation.navigate('Planning', {
          journeyId: journeyId,
          popupText: popupText,
        });
      }
    } else {
      if (error) {
        setError(error);
        return;
      } else if (majorStage && status === 201) {
        majorStageCtx.addMajorStage(majorStage);
        const popupText = `Major Stage "${majorStage.title}" successfully created!`;
        planningNavigation.navigate('Planning', {
          journeyId: journeyId,
          popupText: popupText,
        });
      }
    }
  }

  return (
    <View style={styles.root}>
      {isDeleting && (
        <Modal
          title='Are you sure?'
          content={`If you delete ${majorStageValues.title}, all related Minor Stages will also be deleted permanently`}
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
