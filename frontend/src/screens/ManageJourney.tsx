import { ReactElement, useContext, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';

import {
  ManageJourneyRouteProp,
  BottomTabsParamList,
  JourneyValues,
  Journey,
  Icons,
  JourneyFormValues,
} from '../models';
import { JourneyContext } from '../store/journey-context';
import JourneyForm from '../components/ManageJourney/JourneyForm';
import Button from '../components/UI/Button';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import { createJourney } from '../utils/http';
import { formatDateString } from '../utils';

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
    countries: selectedJourney?.countries || [],
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
        countries: selectedJourney?.countries || [],
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
          countries: [],
        });
        // reset journeyId in navigation params for BottomTab
        navigation.setParams({ journeyId: undefined });
      };
    }, [])
  );

  // async function deleteJourneyHandler() {
  //   setisSubmitting(true);
  //   try {
  //     await deleteExpense(editedExpenseId);
  //     expenseCtx.deleteExpense(editedExpenseId);
  //     navigation.goBack();
  //   } catch (error) {
  //     setError("Could not delete expense!");
  //     setisSubmitting(false);
  //   }
  // }

  function cancelHandler() {
    navigation.goBack();
  }

  function confirmHandler({ status, error, journey }: ConfirmHandlerProps) {
    // if (isEditing) {
    //   // Optimistic Updating
    //   journeyCtx.updateJourney(editedJourneyId, journeyData);
    //   await updateExpense(editedExpenseId, expenseData);
    // } else {

    if (error) {
      setError(error);
      return;
    } else if (journey) {
      journeyCtx.addJourney(journey);
      // TODO: Add little badge, that tells the user that the data was saved
    }

    // }
    navigation.navigate('AllJourneys');
  }

  return (
    <ScrollView>
      <JourneyForm
        onCancel={cancelHandler}
        onSubmit={confirmHandler}
        submitButtonLabel={isEditing ? 'Update' : 'Add'}
        defaultValues={isEditing ? journeyValues : undefined}
      />
      <View style={styles.btnContainer}>
        <IconButton
          icon={Icons.delete}
          color={GlobalStyles.colors.error200}
          onPress={() => {}}
          size={36}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    alignItems: 'center',
    marginTop: 18,
  },
});

export default ManageJourney;
