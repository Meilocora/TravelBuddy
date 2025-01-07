import React, { ReactElement, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Input from '../../UI/form/Input';
import {
  ButtonMode,
  ColorScheme,
  Icons,
  PlaceFormValues,
  PlaceToVisit,
  PlaceValues,
} from '../../../models';
import Button from '../../UI/Button';
import { GlobalStyles } from '../../../constants/styles';
import { Checkbox } from 'react-native-paper';
import {
  createPlace,
  deletePlace,
  updatePlace,
} from '../../../utils/http/place_to_visit';
import IconButton from '../../UI/IconButton';
import Modal from '../../UI/Modal';

type InputValidationResponse = {
  place?: PlaceToVisit;
  placeFormValues?: PlaceFormValues;
  error?: string;
  status: number;
};

interface PlaceFormProps {
  onCancel: () => void;
  onSubmit: (response: InputValidationResponse) => void;
  onDelete: (response: InputValidationResponse, placeId: number) => void;
  submitButtonLabel: string;
  defaultValues?: PlaceValues;
  isEditing?: boolean;
  editPlaceId?: number;
}

const PlaceForm: React.FC<PlaceFormProps> = ({
  onCancel,
  onSubmit,
  onDelete,
  submitButtonLabel,
  defaultValues,
  isEditing,
  editPlaceId,
}): ReactElement => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [inputs, setInputs] = useState<PlaceFormValues>({
    countryId: { value: defaultValues!.countryId, isValid: true, errors: [] },
    name: { value: defaultValues?.name || '', isValid: true, errors: [] },
    description: {
      value: defaultValues?.description || '',
      isValid: true,
      errors: [],
    },
    visited: {
      value: defaultValues?.visited || false,
      isValid: true,
      errors: [],
    },
    favorite: {
      value: defaultValues?.favorite || false,
      isValid: true,
      errors: [],
    },
    link: {
      value: defaultValues?.link || '',
      isValid: true,
      errors: [],
    },
    maps_link: {
      value: defaultValues?.maps_link || '',
      isValid: true,
      errors: [],
    },
  });

  function inputChangedHandler(
    inputIdentifier: string,
    enteredValue: string | boolean
  ): void {
    setInputs((currInputs) => {
      return {
        ...currInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true, errors: [] }, // dynamically use propertynames for objects
      };
    });
  }

  async function validateInputs(): Promise<void> {
    // Set all errors to empty array to prevent stacking of errors
    setIsSubmitting(true);
    for (const key in inputs) {
      inputs[key as keyof PlaceFormValues].errors = [];
    }

    let response: InputValidationResponse;
    if (isEditing) {
      response = await updatePlace(inputs, editPlaceId!);
    } else if (!isEditing) {
      response = await createPlace(inputs);
    }

    const { error, status, place, placeFormValues } = response!;

    if (!error && place) {
      onSubmit({ place, status });
    } else if (error) {
      onSubmit({ error, status });
    } else if (placeFormValues) {
      setInputs((prevValues) => placeFormValues);
    }
    setIsSubmitting(false);
    return;
  }

  async function deletePlaceHandler() {
    const response = await deletePlace(editPlaceId!);
    onDelete(response, editPlaceId!);
    setIsDeleting(false);
    return;
  }

  function deleteHandler() {
    setIsDeleting(true);
  }

  function closeModalHandler() {
    setIsDeleting(false);
  }

  if (isSubmitting) {
    const submitButtonLabel = 'Submitting...';
  }

  return (
    <>
      {isDeleting && (
        <Modal
          title='Are you sure?'
          content={`Do you realy want to  delete ${inputs.name.value}?`}
          onConfirm={deletePlaceHandler}
          onCancel={closeModalHandler}
        />
      )}
      <View style={styles.formContainer}>
        <Text style={styles.header}>Place To Visit</Text>
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
              mandatory
              textInputConfig={{
                value: inputs.description.value,
                onChangeText: inputChangedHandler.bind(this, 'description'),
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
          </View>
          <View style={styles.formRow}>
            <Input
              label='Maps Link'
              invalid={!inputs.maps_link.isValid}
              errors={inputs.maps_link.errors}
              textInputConfig={{
                value: inputs.maps_link.value,
                onChangeText: inputChangedHandler.bind(this, 'maps_link'),
              }}
            />
          </View>
          <View style={styles.formRow}>
            <View style={styles.checkBoxContainer}>
              <Text style={styles.checkBoxLabel}>Visited?</Text>
              <Checkbox
                status={inputs.visited.value ? 'checked' : 'unchecked'}
                onPress={() =>
                  inputChangedHandler('visited', !inputs.visited.value)
                }
                uncheckedColor={GlobalStyles.colors.gray200}
                color={GlobalStyles.colors.primary100}
              />
            </View>
            <View style={styles.checkBoxContainer}>
              <Text style={styles.checkBoxLabel}>Favorite?</Text>
              <Checkbox
                status={inputs.favorite.value ? 'checked' : 'unchecked'}
                onPress={() =>
                  inputChangedHandler('favorite', !inputs.favorite.value)
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
      <View style={styles.deleteContainer}>
        <IconButton
          icon={Icons.delete}
          onPress={deleteHandler}
          size={62}
          color={GlobalStyles.colors.error500}
        />
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
  deleteContainer: {
    width: '100%',
    marginHorizontal: 'auto',
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlaceForm;
