import { ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

import {
  Activity,
  ActivityFormValues,
  ButtonMode,
  ColorScheme,
} from '../../../models';
import Input from '../../UI/form/Input';
import { GlobalStyles } from '../../../constants/styles';
import Button from '../../UI/Button';
import { formatAmount } from '../../../utils';
import { MinorStageContext } from '../../../store/minorStage-context';
import { createActivity, updateActivity } from '../../../utils/http';

type InputValidationResponse = {
  activity?: Activity;
  activityFormValues?: ActivityFormValues;
  backendJourneyId?: number;
  error?: string;
  status: number;
};

interface ActivityFormProps {
  onCancel: () => void;
  onSubmit: (response: InputValidationResponse) => void;
  submitButtonLabel: string;
  defaultValues?: Activity;
  isEditing?: boolean;
  editActivityId?: number;
  minorStageId: number;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  onCancel,
  onSubmit,
  submitButtonLabel,
  defaultValues,
  isEditing,
  editActivityId,
  minorStageId,
}): ReactElement => {
  const minorStageCtx = useContext(MinorStageContext);
  const minorStage = minorStageCtx.minorStages.find(
    (minorStage) => minorStage.id === minorStageId
  );

  const maxAvailableMoney = Math.max(
    minorStage!.costs.budget - minorStage!.costs.spent_money,
    0
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inputs, setInputs] = useState<ActivityFormValues>({
    name: { value: defaultValues?.name || '', isValid: true, errors: [] },
    description: {
      value: defaultValues?.description || '',
      isValid: true,
      errors: [],
    },
    costs: {
      value: defaultValues?.costs || 0,
      isValid: true,
      errors: [],
    },
    booked: {
      value: defaultValues?.booked || false,
      isValid: true,
      errors: [],
    },
    place: {
      value: defaultValues?.place || '',
      isValid: true,
      errors: [],
    },
    link: {
      value: defaultValues?.link || '',
      isValid: true,
      errors: [],
    },
  });

  // Redefine inputs, when defaultValues change
  useEffect(() => {
    setInputs({
      name: { value: defaultValues?.name || '', isValid: true, errors: [] },
      description: {
        value: defaultValues?.description || '',
        isValid: true,
        errors: [],
      },
      costs: {
        value: defaultValues?.costs || 0,
        isValid: true,
        errors: [],
      },
      booked: {
        value: defaultValues?.booked || false,
        isValid: true,
        errors: [],
      },
      place: {
        value: defaultValues?.place || '',
        isValid: true,
        errors: [],
      },
      link: {
        value: defaultValues?.link || '',
        isValid: true,
        errors: [],
      },
    });
  }, [defaultValues]);

  function resetValues() {
    setInputs({
      name: { value: '', isValid: true, errors: [] },
      description: { value: '', isValid: true, errors: [] },
      costs: { value: 0, isValid: true, errors: [] },
      booked: { value: false, isValid: true, errors: [] },
      place: { value: '', isValid: true, errors: [] },
      link: { value: '', isValid: true, errors: [] },
    });
  }

  function inputChangedHandler(
    inputIdentifier: string,
    enteredValue: string | boolean
  ) {
    setInputs((currInputs) => {
      return {
        ...currInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true, errors: [] }, // dynamically use propertynames for objects
      };
    });
  }

  async function validateInputs(): Promise<void> {
    setIsSubmitting(true);

    // Set all errors to empty array to prevent stacking of errors
    for (const key in inputs) {
      inputs[key as keyof ActivityFormValues].errors = [];
    }

    let response: InputValidationResponse;
    if (isEditing) {
      response = await updateActivity(inputs, editActivityId!, minorStageId);
    } else if (!isEditing) {
      response = await createActivity(inputs, minorStageId);
    }

    const { error, status, activity, activityFormValues, backendJourneyId } =
      response!;

    if (!error && minorStage) {
      resetValues();
      onSubmit({ activity, status, backendJourneyId });
    } else if (error) {
      onSubmit({ error, status });
    } else if (activityFormValues) {
      setInputs((prevValues) => activityFormValues);
    }
    setIsSubmitting(false);
    return;
  }

  if (isSubmitting) {
    const submitButtonLabel = 'Submitting...';
  }

  return (
    <>
      <View style={styles.formContainer}>
        <View>
          <View style={styles.formRow}>
            <Input
              label='Name'
              invalid={!inputs.name.isValid}
              errors={inputs.name.errors}
              mandatory
              textInputConfig={{
                value: inputs.name.value,
                onChangeText: inputChangedHandler.bind(this, 'name'),
              }}
            />
          </View>
          <View style={styles.formRow}>
            <Input
              label='Description'
              invalid={!inputs.description.isValid}
              errors={inputs.description.errors}
              textInputConfig={{
                value: inputs.description.value,
                multiline: true,
                onChangeText: inputChangedHandler.bind(this, 'description'),
              }}
            />
          </View>
          <View style={styles.formRow}>
            <Input
              label='Place'
              invalid={!inputs.place.isValid}
              errors={inputs.place.errors}
              textInputConfig={{
                value: inputs.place.value,
                onChangeText: inputChangedHandler.bind(this, 'place'),
              }}
            />
            <Input
              label='Costs'
              invalid={!inputs.costs.isValid}
              errors={inputs.costs.errors}
              textInputConfig={{
                keyboardType: 'decimal-pad',
                value:
                  inputs.costs.value !== 0 ? inputs.costs.value.toString() : '',
                onChangeText: inputChangedHandler.bind(this, 'costs'),
                placeholder:
                  maxAvailableMoney > 0
                    ? `Remaining: ${formatAmount(maxAvailableMoney)}`
                    : '',
              }}
            />
          </View>
          <View style={styles.formRow}>
            <Input
              label='Link'
              invalid={!inputs.link.isValid}
              errors={inputs.link.errors}
              textInputConfig={{
                value: inputs.link.value,
                onChangeText: inputChangedHandler.bind(this, 'link'),
              }}
            />
            <View style={styles.checkBoxContainer}>
              <Text style={styles.checkBoxLabel}>Booked?</Text>
              <Checkbox
                status={inputs.booked.value ? 'checked' : 'unchecked'}
                onPress={() =>
                  inputChangedHandler('booked', !inputs.booked.value)
                }
                uncheckedColor={GlobalStyles.colors.gray200}
                color={GlobalStyles.colors.primary100}
              />
            </View>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            onPress={onCancel}
            colorScheme={ColorScheme.neutral}
            mode={ButtonMode.flat}
          >
            Cancel
          </Button>
          <Button onPress={validateInputs} colorScheme={ColorScheme.neutral}>
            {submitButtonLabel}
          </Button>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    opacity: 0.75,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: GlobalStyles.colors.gray100,
    backgroundColor: GlobalStyles.colors.gray400,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
    marginHorizontal: 12,
  },
  checkBoxContainer: {
    alignItems: 'center',
    marginHorizontal: 'auto',
  },
  checkBoxLabel: {
    color: GlobalStyles.colors.gray50,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '50%',
    marginVertical: 8,
    marginHorizontal: 'auto',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default ActivityForm;
