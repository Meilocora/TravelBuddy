import { ReactElement, useContext, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';

import {
  ManageJourneyRouteProp,
  BottomTabsParamList,
  JourneyValues,
  Journey,
  Icons,
} from '../models';
import { JourneyContext } from '../store/journey-context';
import JourneyForm from '../components/Journeys/ManageJourney/JourneyForm';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import { formatDateString } from '../utils';
import { deleteJourney } from '../utils/http';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Modal from '../components/UI/Modal';
import ErrorOverlay from '../components/UI/ErrorOverlay';

interface ManageJourneyProps {
  route: ManageJourneyRouteProp;
  navigation: BottomTabNavigationProp<BottomTabsParamList, 'ManageJourney'>;
}

interface ConfirmHandlerProps {
  error?: string;
  status: number;
  journey?: Journey;
}

const ManageJourney: React.FC<ManageJourneyProps> = ({
  route,
  navigation,
}): ReactElement => {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const journeyCtx = useContext(JourneyContext);
  const editedJourneyId = route.params?.journeyId;
  let isEditing = !!editedJourneyId;

  const selectedJourney = journeyCtx.journeys.find(
    (journey) => journey.id === editedJourneyId
  );

  // Empty, when no default values provided
  const [journeyValues, setJourneyValues] = useState<JourneyValues>({
    name: selectedJourney?.name || '',
    description: selectedJourney?.description || '',
    scheduled_start_time: selectedJourney?.scheduled_start_time
      ? formatDateString(selectedJourney.scheduled_start_time)
      : null,
    scheduled_end_time: selectedJourney?.scheduled_end_time
      ? formatDateString(selectedJourney.scheduled_end_time)
      : null,
    available_money: selectedJourney?.costs.available_money || 0,
    planned_costs: selectedJourney?.costs.planned_costs || 0,
    countries: selectedJourney?.countries || '',
  });

  useFocusEffect(
    useCallback(() => {
      // JourneyValues set, when screen is focused
      setJourneyValues({
        name: selectedJourney?.name || '',
        description: selectedJourney?.description || '',
        scheduled_start_time: selectedJourney?.scheduled_start_time
          ? formatDateString(selectedJourney.scheduled_start_time)
          : null,
        scheduled_end_time: selectedJourney?.scheduled_end_time
          ? formatDateString(selectedJourney.scheduled_end_time)
          : null,
        available_money: selectedJourney?.costs.available_money || 0,
        planned_costs: selectedJourney?.costs.planned_costs || 0,
        countries: selectedJourney?.countries || '',
      });

      return () => {
        // Clean up function, when screen is unfocused
        // reset JourneyValues
        setJourneyValues({
          name: '',
          description: '',
          scheduled_start_time: null,
          scheduled_end_time: null,
          available_money: 0,
          planned_costs: 0,
          countries: '',
        });
        // reset journeyId in navigation params for BottomTab
        navigation.setParams({ journeyId: undefined });
      };
    }, [])
  );

  async function deleteJourneyHandler() {
    try {
      const { error, status } = await deleteJourney(editedJourneyId!);
      if (!error && status === 200) {
        journeyCtx.deleteJourney(editedJourneyId!);
        const popupText = 'Journey successfully deleted!';
        navigation.navigate('AllJourneys', { popupText: popupText });
      } else {
        setError(error!);
        return;
      }
    } catch (error) {
      setError('Could not delete journey!');
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
    navigation.navigate('AllJourneys');
  }

  function confirmHandler({ status, error, journey }: ConfirmHandlerProps) {
    if (isEditing) {
      if (error) {
        setError(error);
        return;
      } else if (journey && status === 200) {
        journeyCtx.updateJourney(journey);
        const popupText = 'Journey successfully updated!';
        navigation.navigate('AllJourneys', { popupText: popupText });
      }
    } else {
      if (error) {
        setError(error);
        return;
      } else if (journey && status === 201) {
        journeyCtx.addJourney(journey);
        const popupText = 'Journey successfully created!';
        navigation.navigate('AllJourneys', { popupText: popupText });
      }
    }
  }

  return (
    <View style={styles.root}>
      {isDeleting && (
        <Modal
          title='Are you sure?'
          content={`If you delete ${journeyValues.name}, all related Major and Minor Stages will also be deleted permanently`}
          onConfirm={deleteJourneyHandler}
          onCancel={closeModalHandler}
        />
      )}
      {error && <ErrorOverlay message={error} onPress={() => setError(null)} />}
      <Animated.ScrollView entering={FadeInDown}>
        <JourneyForm
          onCancel={cancelHandler}
          onSubmit={confirmHandler}
          submitButtonLabel={isEditing ? 'Update' : 'Add'}
          defaultValues={isEditing ? journeyValues : undefined}
          isEditing={isEditing}
          editJourneyId={editedJourneyId}
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

export default ManageJourney;
