import { ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

import {
  ButtonMode,
  ColorScheme,
  Transportation,
  TransportationFormValues,
  TransportationType,
  TransportationValues,
} from '../../models';
import Input from '../UI/form/Input';
import DatePicker from '../UI/form/DatePicker';
import { formatDate, parseDate } from '../../utils';
import Button from '../UI/Button';
import { GlobalStyles } from '../../constants/styles';
import { MajorStageContext } from '../../store/majorStage-context.';
import DateTimePicker from '../UI/form/DateTimePicker';
import TransportTypeSelector from './TransportTypeSelector';

type InputValidationResponse = {
  transportation?: Transportation;
  transportationFormValues?: TransportationFormValues;
  error?: string;
  status: number;
};

interface TransportationFormProps {
  onCancel: () => void;
  onSubmit: (response: InputValidationResponse) => void;
  submitButtonLabel: string;
  defaultValues?: TransportationValues;
  isEditing?: boolean;
  journeyId: number;
  majorStageId: number;
  minorStageId?: number;
}

const TransportationForm: React.FC<TransportationFormProps> = ({
  onCancel,
  onSubmit,
  submitButtonLabel,
  defaultValues,
  isEditing,
  journeyId,
  majorStageId,
  minorStageId,
}): ReactElement => {
  const majorStageCtx = useContext(MajorStageContext);
  const majorStage = majorStageCtx.majorStages.find(
    (ms) => ms.id === majorStageId
  );
  // const journeyCtx = useContext(JourneyContext);
  // const journey = journeyCtx.journeys.find((j) => j.id === journeyId);

  const minStartDate = parseDate(majorStage!.scheduled_start_time);
  minStartDate.setDate(minStartDate.getDate() - 1);
  const maxStartDate = parseDate(majorStage!.scheduled_start_time);
  maxStartDate.setDate(maxStartDate.getDate() + 1);

  // const maxEndDate = journey!.scheduled_end_time;

  // const majorStagesIds = journey?.majorStagesIds;
  // const majorStageCtx = useContext(MajorStageContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);

  const [inputs, setInputs] = useState<TransportationFormValues>({
    type: {
      value: defaultValues?.type || '',
      isValid: true,
      errors: [],
    },
    start_time: {
      value: defaultValues?.start_time || null,
      isValid: true,
      errors: [],
    },
    arrival_time: {
      value: defaultValues?.arrival_time || null,
      isValid: true,
      errors: [],
    },
    place_of_departure: {
      value: defaultValues?.place_of_departure || '',
      isValid: true,
      errors: [],
    },
    place_of_arrival: {
      value: defaultValues?.place_of_arrival || '',
      isValid: true,
      errors: [],
    },
    transportation_costs: {
      value: defaultValues?.transportation_costs || 0,
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
      type: {
        value: defaultValues?.type || '',
        isValid: true,
        errors: [],
      },
      start_time: {
        value: defaultValues?.start_time || null,
        isValid: true,
        errors: [],
      },
      arrival_time: {
        value: defaultValues?.arrival_time || null,
        isValid: true,
        errors: [],
      },
      place_of_departure: {
        value: defaultValues?.place_of_departure || '',
        isValid: true,
        errors: [],
      },
      place_of_arrival: {
        value: defaultValues?.place_of_arrival || '',
        isValid: true,
        errors: [],
      },
      transportation_costs: {
        value: defaultValues?.transportation_costs || 0,
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

  function validateInputs() {}

  // async function validateInputs(): Promise<void> {
  //   setIsSubmitting(true);

  //   // Set all errors to empty array to prevent stacking of errors
  //   for (const key in inputs) {
  //     inputs[key as keyof MajorStageFormValues].errors = [];
  //   }

  //   let response: InputValidationResponse;
  //   if (isEditing) {
  //     const former_country = majorStageCtx.majorStages.find(
  //       (ms) => ms.id === editMajorStageId
  //     )?.country;

  //     if (!updateConfirmed && inputs.country.value !== former_country) {
  //       setChangeCountry(true);
  //       return;
  //     }
  //     response = await updateMajorStage(journeyId, inputs, editMajorStageId!);
  //   } else if (!isEditing) {
  //     response = await createMajorStage(journeyId, inputs);
  //   }

  //   const { error, status, majorStage, majorStageFormValues } = response!;

  //   if (!error && majorStage) {
  //     onSubmit({ majorStage, status });
  //   } else if (error) {
  //     onSubmit({ error, status });
  //   } else if (majorStageFormValues) {
  //     setInputs((prevValues) => majorStageFormValues);
  //   }
  //   setIsSubmitting(false);
  //   return;
  // }

  if (isSubmitting) {
    const submitButtonLabel = 'Submitting...';
  }

  function handleChangeDate(inputIdentifier: string, selectedDate: string) {
    setInputs((prevValues) => ({
      ...prevValues,
      [inputIdentifier]: {
        value: selectedDate,
        isValid: true,
        errors: [],
      },
    }));
    setOpenStartDatePicker(false);
    setOpenEndDatePicker(false);
  }

  return (
    <View style={styles.formContainer}>
      <Text style={styles.header}>Destination: "{majorStage!.country}"</Text>
      <View>
        <View style={styles.formRow}>
          <TransportTypeSelector
            onChangeTransportType={inputChangedHandler.bind(this, 'type')}
            defaultType={inputs.type.value}
            invalid={!inputs.type.isValid}
            errors={inputs.type.errors}
          />
          <Input
            label='Costs'
            invalid={!inputs.transportation_costs.isValid}
            errors={inputs.transportation_costs.errors}
            textInputConfig={{
              keyboardType: 'decimal-pad',
              value:
                inputs.transportation_costs.value !== 0
                  ? inputs.transportation_costs.value.toString()
                  : '',
              onChangeText: inputChangedHandler.bind(
                this,
                'transportation_costs'
              ),
            }}
          />
        </View>
        <View style={styles.formRow}>
          {/* TODO: Maybe add links to places, so the user can just tap on the name and get to google maps immediately */}
          <Input
            label='Place of departure'
            invalid={!inputs.place_of_departure.isValid}
            errors={inputs.place_of_departure.errors}
            mandatory
            textInputConfig={{
              value: inputs.place_of_departure.value,
              onChangeText: inputChangedHandler.bind(
                this,
                'place_of_departure'
              ),
            }}
          />
          {/* TODO: Maybe add links to places, so the user can just tap on the name and get to google maps immediately */}
          <Input
            label='Place of arrival'
            invalid={!inputs.place_of_arrival.isValid}
            errors={inputs.place_of_arrival.errors}
            mandatory
            textInputConfig={{
              value: inputs.place_of_arrival.value,
              onChangeText: inputChangedHandler.bind(this, 'place_of_arrival'),
            }}
          />
        </View>
        <View style={styles.formRow}>
          <DateTimePicker
            openDatePicker={openStartDatePicker}
            setOpenDatePicker={() =>
              setOpenStartDatePicker((prevValue) => !prevValue)
            }
            handleChange={handleChangeDate}
            inputIdentifier='start_time'
            invalid={!inputs.start_time.isValid}
            errors={inputs.start_time.errors}
            value={inputs.start_time.value?.toString()}
            label='Departure'
            minimumDate={minStartDate}
            maximumDate={maxStartDate}
          />
          <DateTimePicker
            openDatePicker={openEndDatePicker}
            setOpenDatePicker={() => setOpenEndDatePicker(true)}
            handleChange={handleChangeDate}
            inputIdentifier='arrival_time'
            invalid={!inputs.arrival_time.isValid}
            errors={inputs.arrival_time.errors}
            value={inputs.arrival_time.value?.toString()}
            label='Arrival'
            minimumDate={minStartDate}
            maximumDate={maxStartDate}
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
  );
};

const styles = StyleSheet.create({
  formContainer: {
    opacity: 0.75,
    marginHorizontal: 16,
    marginTop: '15%',
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
  buttonsContainer: {
    flexDirection: 'row',
    width: '50%',
    marginVertical: 8,
    marginHorizontal: 'auto',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default TransportationForm;
