import { ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

import {
  ButtonMode,
  ColorScheme,
  MinorStage,
  MinorStageFormValues,
  MinorStageValues,
} from '../../../models';
import Input from '../../UI/form/Input';
import { GlobalStyles } from '../../../constants/styles';
import Button from '../../UI/Button';
import { formatAmount, formatDate, parseDate } from '../../../utils';
import DatePicker from '../../UI/form/DatePicker';
import Modal from '../../UI/Modal';
import { JourneyContext } from '../../../store/journey-context';
import { MajorStageContext } from '../../../store/majorStage-context.';
import { MinorStageContext } from '../../../store/minorStage-context';
import PlacesSelectionForm from './PlacesSelectionForm';

type InputValidationResponse = {
  minorStage?: MinorStage;
  minorStageFormValues?: MinorStageFormValues;
  error?: string;
  status: number;
};

interface MinorStageFormProps {
  onCancel: () => void;
  onSubmit: (response: InputValidationResponse) => void;
  submitButtonLabel: string;
  defaultValues?: MinorStageValues;
  isEditing?: boolean;
  editMinorStageId?: number;
  majorStageId: number;
  journeyId: number;
}

const MinorStageForm: React.FC<MinorStageFormProps> = ({
  onCancel,
  onSubmit,
  submitButtonLabel,
  defaultValues,
  isEditing,
  editMinorStageId,
  majorStageId,
  journeyId,
}): ReactElement => {
  // TODO: This really needed?!
  const journeyCtx = useContext(JourneyContext);
  // const journey = journeyCtx.journeys.find((j) => j.id === journeyId);

  const majorStageCtx = useContext(MajorStageContext);
  const majorStage = majorStageCtx.majorStages.find(
    (ms) => ms.id === majorStageId
  );
  const countryName = majorStage!.country;

  const minStartDate = majorStage!.scheduled_start_time;
  const maxEndDate = majorStage!.scheduled_end_time;

  let maxAvailableMoney = majorStage!.costs.budget;

  const minorStageCtx = useContext(MinorStageContext);
  const minorStages = minorStageCtx.minorStages;
  minorStages.forEach((ms) => {
    maxAvailableMoney -= ms.costs.budget;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);

  const [inputs, setInputs] = useState<MinorStageFormValues>({
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
    accommodation_name: {
      value: defaultValues?.accommodation_name || '',
      isValid: true,
      errors: [],
    },
    accommodation_place: {
      value: defaultValues?.accommodation_place || '',
      isValid: true,
      errors: [],
    },
    accommodation_costs: {
      value: defaultValues?.accommodation_costs || 0,
      isValid: true,
      errors: [],
    },
    accommodation_booked: {
      value: defaultValues?.accommodation_booked || false,
      isValid: true,
      errors: [],
    },
    accommodation_link: {
      value: defaultValues?.accommodation_link || '',
      isValid: true,
      errors: [],
    },
    accommodation_maps_link: {
      value: defaultValues?.accommodation_maps_link || '',
      isValid: true,
      errors: [],
    },
    placesToVisist: {
      value: defaultValues?.placesToVisist || '',
      isValid: true,
      errors: [],
    },
  });

  const [maxAvailableMoneyAccommodation, setMaxAvailableMoneyAccommodation] =
    useState(Math.max(0, inputs.budget.value));
  useEffect(() => {
    setMaxAvailableMoneyAccommodation(Math.max(0, inputs.budget.value));
    setInputs((prevValues) => {
      return {
        ...prevValues,
        accommodation_costs: {
          value: prevValues.accommodation_costs.value,
          isValid: true,
          errors: [],
        },
      };
    });
  }, [inputs.budget.value]);

  const defaultPlacesNames = defaultValues?.placesToVisist?.split(', ') || [];
  // State only exists for easier handling of countryNames
  const [currentPlacesNames, setCurrentPlacesNames] =
    useState<string[]>(defaultPlacesNames);

  function handleAddPlace(placeName: string) {
    setCurrentPlacesNames([...currentPlacesNames, placeName]);

    const updatedPlaceNames = [...currentPlacesNames, placeName];

    setInputs((prevValues) => {
      return {
        ...prevValues,
        placesToVisist: {
          value: updatedPlaceNames.join(', '),
          isValid: true,
          errors: [],
        },
      };
    });
  }

  function handleDeletePlace(placeName: string) {
    setCurrentPlacesNames(
      currentPlacesNames.filter((name) => name !== placeName)
    );

    const updatedCountryNames = [...currentPlacesNames];

    setInputs((prevValues) => {
      return {
        ...prevValues,
        placesToVisist: {
          value: currentPlacesNames
            .filter((name) => name !== placeName)
            .join(', '),
          isValid: true,
          errors: [],
        },
      };
    });
  }

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
      accommodation_name: {
        value: defaultValues?.accommodation_name || '',
        isValid: true,
        errors: [],
      },
      accommodation_place: {
        value: defaultValues?.accommodation_place || '',
        isValid: true,
        errors: [],
      },
      accommodation_costs: {
        value: defaultValues?.accommodation_costs || 0,
        isValid: true,
        errors: [],
      },
      accommodation_booked: {
        value: defaultValues?.accommodation_booked || false,
        isValid: true,
        errors: [],
      },
      accommodation_link: {
        value: defaultValues?.accommodation_link || '',
        isValid: true,
        errors: [],
      },
      accommodation_maps_link: {
        value: defaultValues?.accommodation_maps_link || '',
        isValid: true,
        errors: [],
      },
      placesToVisist: {
        value: defaultValues?.placesToVisist || '',
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
      budget: { value: 0, isValid: true, errors: [] },
      spent_money: { value: 0, isValid: true, errors: [] },
      accommodation_name: { value: '', isValid: true, errors: [] },
      accommodation_place: { value: '', isValid: true, errors: [] },
      accommodation_costs: { value: 0, isValid: true, errors: [] },
      accommodation_booked: { value: false, isValid: true, errors: [] },
      accommodation_link: { value: '', isValid: true, errors: [] },
      accommodation_maps_link: { value: '', isValid: true, errors: [] },
      placesToVisist: { value: '', isValid: true, errors: [] },
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

  // function handleChangeCountry(countryName: string) {
  //   setInputs((prevValues) => {
  //     return {
  //       ...prevValues,
  //       country: {
  //         value: countryName,
  //         isValid: true,
  //         errors: [],
  //       },
  //     };
  //   });
  // }

  // async function validateInputs(): Promise<void> {
  //   setIsSubmitting(true);

  //   // Set all errors to empty array to prevent stacking of errors
  //   for (const key in inputs) {
  //     inputs[key as keyof MinorStageFormValues].errors = [];
  //   }

  //   let response: InputValidationResponse;
  //   if (isEditing) {
  //     const former_country = majorStageCtx.majorStages.find(
  //       (ms) => ms.id === editMajorStageId
  //     )?.country;

  // TODO: Change following lines, so there will be a modal, when accommodation_costs > maxAvailableMoneyAccommodation
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
  //     resetValues();
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

  return (
    <>
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
              mandatory
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
          <View style={styles.separator}>
            <Text style={styles.subtitle}>Accommodation</Text>
          </View>
          <View style={styles.formRow}>
            <Input
              label='Name'
              invalid={!inputs.accommodation_name.isValid}
              errors={inputs.accommodation_name.errors}
              mandatory
              textInputConfig={{
                value: inputs.accommodation_name.value,
                onChangeText: inputChangedHandler.bind(
                  this,
                  'accommodation_name'
                ),
              }}
            />
            <View style={styles.checkBoxContainer}>
              <Text style={styles.checkBoxLabel}>Booked?</Text>
              <Checkbox
                status={
                  inputs.accommodation_booked.value ? 'checked' : 'unchecked'
                }
                onPress={() =>
                  inputChangedHandler(
                    'accommodation_booked',
                    !inputs.accommodation_booked.value
                  )
                }
                uncheckedColor={GlobalStyles.colors.gray200}
                color={GlobalStyles.colors.primary100}
              />
            </View>
          </View>
          <View style={styles.formRow}>
            <Input
              label='Place'
              invalid={!inputs.accommodation_place.isValid}
              errors={inputs.accommodation_place.errors}
              mandatory
              textInputConfig={{
                value: inputs.accommodation_place.value,
                onChangeText: inputChangedHandler.bind(
                  this,
                  'accommodation_place'
                ),
              }}
            />
            <Input
              label='Costs'
              invalid={!inputs.accommodation_costs.isValid}
              errors={inputs.accommodation_costs.errors}
              mandatory
              textInputConfig={{
                keyboardType: 'decimal-pad',
                value:
                  inputs.accommodation_costs.value !== 0
                    ? inputs.accommodation_costs.value!.toString()
                    : '',
                onChangeText: inputChangedHandler.bind(
                  this,
                  'accommodation_costs'
                ),
                placeholder: maxAvailableMoneyAccommodation
                  ? `Max: ${formatAmount(maxAvailableMoneyAccommodation)}`
                  : '',
              }}
            />
          </View>
          <View style={styles.formRow}>
            <Input
              label='Link'
              invalid={!inputs.accommodation_link.isValid}
              errors={inputs.accommodation_link.errors}
              mandatory
              textInputConfig={{
                value: inputs.accommodation_link.value,
                onChangeText: inputChangedHandler.bind(
                  this,
                  'accommodation_link'
                ),
              }}
            />
          </View>
          <View style={styles.formRow}>
            <Input
              label='Maps Link'
              invalid={!inputs.accommodation_maps_link.isValid}
              errors={inputs.accommodation_maps_link.errors}
              mandatory
              textInputConfig={{
                value: inputs.accommodation_maps_link.value,
                onChangeText: inputChangedHandler.bind(
                  this,
                  'accommodation_maps_link'
                ),
              }}
            />
          </View>
          <PlacesSelectionForm
            onAddPlace={handleAddPlace}
            onDeletePlace={handleDeletePlace}
            invalid={!inputs.placesToVisist.isValid}
            defaultPlaceNames={defaultPlacesNames}
            countryId={1}
          />
          {/* TODO: Picker for Places_to_visit ?! ... or put inside minorStageListElement if it gets too much for one form */}
          {/* <View style={styles.formRow}>
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
                  color={GlobalStyles.colors.primary100}
                />
              </View>
            )}
          </View> */}
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            onPress={onCancel}
            colorScheme={ColorScheme.neutral}
            mode={ButtonMode.flat}
          >
            Cancel
          </Button>
          <Button onPress={() => {}} colorScheme={ColorScheme.neutral}>
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
    marginVertical: 4,
    marginHorizontal: 12,
  },
  separator: {
    borderTopColor: GlobalStyles.colors.gray100,
    borderTopWidth: 2,
    marginTop: 8,
  },
  subtitle: {
    alignSelf: 'center',
    fontSize: 18,
    color: GlobalStyles.colors.gray50,
    fontWeight: 'bold',
    textAlign: 'center',
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

export default MinorStageForm;
