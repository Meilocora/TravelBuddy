import { ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

import {
  ButtonMode,
  ColorScheme,
  MajorStage,
  MajorStageFormValues,
  MajorStageValues,
} from '../../../models';
import Input from '../../UI/form/Input';
import { GlobalStyles } from '../../../constants/styles';
import Button from '../../UI/Button';
import { formatAmount, formatDate, parseDate } from '../../../utils';
import DatePicker from '../../UI/form/DatePicker';
import Modal from '../../UI/Modal';
import CountrySelector from './CountrySelector';
import { JourneyContext } from '../../../store/journey-context';
import { MajorStageContext } from '../../../store/majorStage-context.';
import { createMajorStage, updateMajorStage } from '../../../utils/http';

type InputValidationResponse = {
  majorStage?: MajorStage;
  majorStageFormValues?: MajorStageFormValues;
  error?: string;
  status: number;
};

interface MajorStageFormProps {
  onCancel: () => void;
  onSubmit: (response: InputValidationResponse) => void;
  submitButtonLabel: string;
  defaultValues?: MajorStageValues;
  isEditing?: boolean;
  editMajorStageId?: number;
  journeyId: number;
}

const MajorStageForm: React.FC<MajorStageFormProps> = ({
  onCancel,
  onSubmit,
  submitButtonLabel,
  defaultValues,
  isEditing,
  editMajorStageId,
  journeyId,
}): ReactElement => {
  const journeyCtx = useContext(JourneyContext);
  const journey = journeyCtx.journeys.find((j) => j.id === journeyId);
  const minStartDate = journey!.scheduled_start_time;
  const maxEndDate = journey!.scheduled_end_time;

  let maxAvailableMoney = journey!.costs.budget;
  const majorStageCtx = useContext(MajorStageContext);
  const majorStages = majorStageCtx.majorStages;
  majorStages.forEach((ms) => {
    maxAvailableMoney -= ms.costs.budget;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [changeCountry, setChangeCountry] = useState(false);
  const [updateConfirmed, setUpdateConfirmed] = useState(false);

  const [inputs, setInputs] = useState<MajorStageFormValues>({
    title: { value: defaultValues?.title || '', isValid: true, errors: [] },
    done: {
      value: defaultValues?.done || false,
      isValid: true,
      errors: [],
    },
    scheduled_start_time: {
      value: defaultValues?.scheduled_start_time || null,
      isValid: true,
      errors: [],
    },
    scheduled_end_time: {
      value: defaultValues?.scheduled_end_time || null,
      isValid: true,
      errors: [],
    },
    additional_info: {
      value: defaultValues?.additional_info || '',
      isValid: true,
      errors: [],
    },
    budget: {
      value: defaultValues?.budget || 0,
      isValid: true,
      errors: [],
    },
    spent_money: {
      value: defaultValues?.spent_money || 0,
      isValid: true,
      errors: [],
    },
    country: {
      value: defaultValues?.country || '',
      isValid: true,
      errors: [],
    },
  });

  // Redefine inputs, when defaultValues change
  useEffect(() => {
    setInputs({
      title: { value: defaultValues?.title || '', isValid: true, errors: [] },
      done: {
        value: defaultValues?.done || false,
        isValid: true,
        errors: [],
      },
      scheduled_start_time: {
        value: defaultValues?.scheduled_start_time || null,
        isValid: true,
        errors: [],
      },
      scheduled_end_time: {
        value: defaultValues?.scheduled_end_time || null,
        isValid: true,
        errors: [],
      },
      additional_info: {
        value: defaultValues?.additional_info || '',
        isValid: true,
        errors: [],
      },
      budget: {
        value: defaultValues?.budget || 0,
        isValid: true,
        errors: [],
      },
      spent_money: {
        value: defaultValues?.spent_money || 0,
        isValid: true,
        errors: [],
      },
      country: {
        value: defaultValues?.country || '',
        isValid: true,
        errors: [],
      },
    });
  }, [defaultValues]);

  function resetValues() {
    setInputs({
      title: { value: '', isValid: true, errors: [] },
      done: { value: false, isValid: true, errors: [] },
      scheduled_start_time: { value: null, isValid: true, errors: [] },
      scheduled_end_time: { value: null, isValid: true, errors: [] },
      additional_info: { value: '', isValid: true, errors: [] },
      budget: { value: 0, isValid: true, errors: [] },
      spent_money: { value: 0, isValid: true, errors: [] },
      country: { value: '', isValid: true, errors: [] },
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

  function handleChangeCountry(countryName: string) {
    setInputs((prevValues) => {
      return {
        ...prevValues,
        country: {
          value: countryName,
          isValid: true,
          errors: [],
        },
      };
    });
  }

  async function validateInputs(): Promise<void> {
    setIsSubmitting(true);

    // Set all errors to empty array to prevent stacking of errors
    for (const key in inputs) {
      inputs[key as keyof MajorStageFormValues].errors = [];
    }

    let response: InputValidationResponse;
    if (isEditing) {
      const former_country = majorStageCtx.majorStages.find(
        (ms) => ms.id === editMajorStageId
      )?.country;

      if (!updateConfirmed && inputs.country.value !== former_country) {
        setChangeCountry(true);
        return;
      }
      response = await updateMajorStage(journeyId, inputs, editMajorStageId!);
    } else if (!isEditing) {
      response = await createMajorStage(journeyId, inputs);
    }

    const { error, status, majorStage, majorStageFormValues } = response!;

    if (!error && majorStage) {
      resetValues();
      onSubmit({ majorStage, status });
    } else if (error) {
      onSubmit({ error, status });
    } else if (majorStageFormValues) {
      setInputs((prevValues) => majorStageFormValues);
    }
    setIsSubmitting(false);
    return;
  }

  if (isSubmitting) {
    const submitButtonLabel = 'Submitting...';
  }

  function handleChangeDate(
    inputIdentifier: string,
    selectedDate: Date | undefined
  ) {
    if (selectedDate === undefined) {
      return;
    }
    const formattedDate = formatDate(new Date(selectedDate));
    setInputs((prevValues) => ({
      ...prevValues,
      [inputIdentifier]: {
        value: formattedDate,
        isValid: true,
        errors: [],
      },
    }));
    setOpenStartDatePicker(false);
    setOpenEndDatePicker(false);
  }

  function confirmModalHandler() {
    setChangeCountry(false);
    setUpdateConfirmed(true);
    validateInputs();
  }

  function closeModalHandler() {
    setChangeCountry(false);
  }

  return (
    <>
      {changeCountry && (
        <Modal
          title='Are you sure?'
          content={`When you change the country, all Minor Stages that are connected to ${inputs.title.value} will be deleted.`}
          confirmText='Change'
          onConfirm={confirmModalHandler}
          onCancel={closeModalHandler}
        />
      )}
      <View style={styles.formContainer}>
        <View>
          <View style={styles.formRow}>
            <Input
              label='Title'
              invalid={!inputs.title.isValid}
              errors={inputs.title.errors}
              mandatory
              textInputConfig={{
                value: inputs.title.value,
                onChangeText: inputChangedHandler.bind(this, 'title'),
              }}
            />
          </View>
          <View style={styles.formRow}>
            <Input
              label='Additional Information'
              invalid={!inputs.additional_info.isValid}
              errors={inputs.additional_info.errors}
              textInputConfig={{
                multiline: true,
                value: inputs.additional_info.value,
                onChangeText: inputChangedHandler.bind(this, 'additional_info'),
              }}
            />
          </View>
          <View style={styles.formRow}>
            <Input
              label='Spent Money'
              invalid={!inputs.spent_money.isValid}
              textInputConfig={{
                readOnly: true,
                placeholder: inputs.spent_money.value.toString(),
              }}
            />
            <Input
              label='Budget'
              invalid={!inputs.budget.isValid}
              errors={inputs.budget.errors}
              textInputConfig={{
                keyboardType: 'decimal-pad',
                value:
                  inputs.budget.value !== 0
                    ? inputs.budget.value.toString()
                    : '',
                onChangeText: inputChangedHandler.bind(this, 'budget'),
                placeholder: `Max: ${formatAmount(maxAvailableMoney)}`,
              }}
            />
          </View>
          <View style={styles.formRow}>
            <DatePicker
              openDatePicker={openStartDatePicker}
              setOpenDatePicker={() =>
                setOpenStartDatePicker((prevValue) => !prevValue)
              }
              handleChange={handleChangeDate}
              inputIdentifier='scheduled_start_time'
              invalid={!inputs.scheduled_start_time.isValid}
              errors={inputs.scheduled_start_time.errors}
              value={inputs.scheduled_start_time.value?.toString()}
              label='Starts on'
              minimumDate={parseDate(minStartDate)}
              maximumDate={
                inputs.scheduled_end_time.value
                  ? parseDate(inputs.scheduled_end_time.value)
                  : parseDate(maxEndDate)
              }
            />
            <DatePicker
              openDatePicker={openEndDatePicker}
              setOpenDatePicker={() =>
                setOpenEndDatePicker((prevValue) => !prevValue)
              }
              handleChange={handleChangeDate}
              inputIdentifier='scheduled_end_time'
              invalid={!inputs.scheduled_end_time.isValid}
              errors={inputs.scheduled_end_time.errors}
              value={inputs.scheduled_end_time.value?.toString()}
              label='Ends on'
              minimumDate={
                inputs.scheduled_start_time.value
                  ? parseDate(inputs.scheduled_start_time.value)
                  : parseDate(minStartDate)
              }
              maximumDate={parseDate(maxEndDate)}
            />
          </View>
          <View style={styles.formRow}>
            <CountrySelector
              onChangeCountry={handleChangeCountry}
              errors={inputs.country.errors}
              invalid={false}
              journeyId={journeyId}
              defaultCountryName={inputs.country.value}
            />
            {isEditing && (
              <View style={styles.checkBoxContainer}>
                <Text style={styles.checkBoxLabel}>Stage done?</Text>
                <Checkbox
                  status={inputs.done.value ? 'checked' : 'unchecked'}
                  onPress={() =>
                    inputChangedHandler('done', !inputs.done.value)
                  }
                  uncheckedColor={GlobalStyles.colors.gray200}
                  color={GlobalStyles.colors.accent100}
                />
              </View>
            )}
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
  header: {
    fontSize: 22,
    textAlign: 'center',
    color: GlobalStyles.colors.gray50,
    fontWeight: 'bold',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
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

export default MajorStageForm;
