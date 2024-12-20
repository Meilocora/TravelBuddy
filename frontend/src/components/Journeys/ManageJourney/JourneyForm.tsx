import { ReactElement, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  ButtonMode,
  ColorScheme,
  JourneyFormValues,
  JourneyValues,
  Journey,
} from '../../../models';
import Input from '../../UI/form/Input';
import { GlobalStyles } from '../../../constants/styles';
import Button from '../../UI/Button';
import { createJourney, updateJourney } from '../../../utils/http';
import CountriesSelection from './CountriesSelection';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../../utils';

type InputValidationResponse = {
  journey?: Journey;
  journeyFormValues?: JourneyFormValues;
  error?: string;
  status: number;
};

interface JourneyFormProps {
  onCancel: () => void;
  onSubmit: (response: InputValidationResponse) => void;
  submitButtonLabel: string;
  defaultValues?: JourneyValues;
  isEditing?: boolean;
  editJourneyId?: number;
}

const JourneyForm: React.FC<JourneyFormProps> = ({
  onCancel,
  onSubmit,
  submitButtonLabel,
  defaultValues,
  isEditing,
  editJourneyId,
}): ReactElement => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputs, setInputs] = useState<JourneyFormValues>({
    name: { value: defaultValues?.name || '', isValid: true, errors: [] },
    description: {
      value: defaultValues?.description || '',
      isValid: true,
      errors: [],
    },
    available_money: {
      value: defaultValues?.available_money || 0,
      isValid: true,
      errors: [],
    },
    planned_costs: {
      value: defaultValues?.planned_costs || 0,
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
    countries: {
      value: defaultValues?.countries || '',
      isValid: true,
      errors: [],
    },
  });

  const defaultCountriesNames = defaultValues?.countries.split(',') || [];
  // State only exists for easier handling of countryNames
  const [currentCountryNames, setCurrentCountryNames] = useState<string[]>(
    defaultCountriesNames
  );

  function inputChangedHandler(inputIdentifier: string, enteredValue: string) {
    setInputs((currInputs) => {
      return {
        ...currInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true, errors: [] }, // dynamically use propertynames for objects
      };
    });
  }

  function handleAddCountry(countryName: string) {
    setCurrentCountryNames([...currentCountryNames, countryName]);

    const updatedCountryNames = [...currentCountryNames, countryName];

    setInputs((prevValues) => {
      return {
        ...prevValues,
        countries: {
          value: updatedCountryNames.join(','),
          isValid: true,
          errors: [],
        },
      };
    });
  }

  function handleDeleteCountry(countryName: string) {
    setCurrentCountryNames(
      currentCountryNames.filter((name) => name !== countryName)
    );

    const updatedCountryNames = [...currentCountryNames, countryName];

    setInputs((prevValues) => {
      return {
        ...prevValues,
        countries: {
          value: updatedCountryNames.join(','),
          isValid: true,
          errors: [],
        },
      };
    });
  }

  async function validateInputs(): Promise<void> {
    // Set all errors to empty array to prevent stacking of errors
    setIsSubmitting(true);

    for (const key in inputs) {
      inputs[key as keyof JourneyFormValues].errors = [];
    }

    let response: InputValidationResponse;
    if (isEditing) {
      // TODO: Test when editing a Journey
      const defaultCountryDeleted = defaultCountriesNames.some(
        (country) => !currentCountryNames.includes(country)
      );

      if (defaultCountryDeleted) {
        const deletedCountries = defaultCountriesNames.filter(
          (country) => !currentCountryNames.includes(country)
        );
        // TODO: Turn into text for Modal
        console.log(
          `Major Stages and Minor Stages, that are connected to the following countries will be deleted: ${deletedCountries.join(
            ', '
          )}`
        );
        return;
        response = await updateJourney(inputs, editJourneyId!);
      }
    } else if (!isEditing) {
      console.log(inputs);
      response = await createJourney(inputs);
    }

    const { error, status, journey, journeyFormValues } = response!;

    if (!error && journey) {
      onSubmit({ journey, status });
    } else if (error) {
      onSubmit({ error, status });
    } else if (journeyFormValues) {
      setInputs((prevValues) => journeyFormValues);
    }
    setIsSubmitting(false);
    return;
  }

  if (isSubmitting) {
    const submitButtonLabel = 'Submitting...';
  }

  // TODO: Put into seperate component
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);

  return (
    <View style={styles.formContainer}>
      <Text style={styles.header}>Your Journey</Text>
      <View>
        <Input
          label='Name'
          invalid={!inputs.name.isValid}
          errors={inputs.name.errors}
          textInputConfig={{
            value: inputs.name.value,
            onChangeText: inputChangedHandler.bind(this, 'name'),
          }}
        />
        <Input
          label='Description'
          invalid={!inputs.description.isValid}
          errors={inputs.description.errors}
          textInputConfig={{
            multiline: true,
            value: inputs.description.value,
            onChangeText: inputChangedHandler.bind(this, 'description'),
          }}
        />
        <View style={styles.formRow}>
          <Input
            label='Planned Costs'
            invalid={!inputs.planned_costs.isValid}
            textInputConfig={{
              readOnly: true,
              placeholder: inputs.planned_costs.value.toString(),
            }}
          />
          <Input
            label='Available Money'
            invalid={!inputs.available_money.isValid}
            errors={inputs.available_money.errors}
            textInputConfig={{
              keyboardType: 'decimal-pad',
              value: inputs.available_money.value.toString(),
              onChangeText: inputChangedHandler.bind(this, 'available_money'),
            }}
          />
        </View>
        <View style={styles.formRow}>
          {/* TODO: Make whole new component with this */}
          {/* TODO: Change format to DD.MM.YYYY */}
          <Pressable onPress={() => setOpenStartDatePicker(true)}>
            <Input
              label='Starts on'
              invalid={!inputs.scheduled_start_time.isValid}
              errors={inputs.scheduled_start_time.errors}
              textInputConfig={{
                placeholder: 'Choose Date',
                readOnly: true,
                value: inputs.scheduled_start_time.value?.toString(),
                onChangeText: inputChangedHandler.bind(
                  this,
                  'scheduled_start_time'
                ),
              }}
            />
          </Pressable>
          {openStartDatePicker && (
            <RNDateTimePicker
              value={new Date(inputs.scheduled_start_time.value!) || new Date()}
              minimumDate={new Date()}
              mode='date'
              display='calendar'
              onChange={(event, selectedDate) => {
                const formattedDate = formatDate(new Date(selectedDate!));
                setInputs((prevValues) => ({
                  ...prevValues,
                  scheduled_start_time: {
                    value: formattedDate,
                    isValid: true,
                    errors: [],
                  },
                }));
                setOpenStartDatePicker(false);
                console.log(inputs.scheduled_start_time.value);
              }}
            />
          )}
          {/* TODO: End of new component */}
          <Input
            label='Ends on'
            invalid={!inputs.scheduled_end_time.isValid}
            errors={inputs.scheduled_end_time.errors}
            textInputConfig={{
              placeholder: 'YYYY-MM-DD',
              maxLength: 10,
              value: inputs.scheduled_end_time.value?.toString(),
              onChangeText: inputChangedHandler.bind(
                this,
                'scheduled_end_time'
              ),
            }}
          />
        </View>
        <CountriesSelection
          onAddCountry={handleAddCountry}
          onDeleteCountry={handleDeleteCountry}
          invalid={!inputs.countries.isValid}
        />
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

export default JourneyForm;
