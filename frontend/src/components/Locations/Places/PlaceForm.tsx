import { ReactElement, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Input from '../../UI/form/Input';
import {
  ButtonMode,
  ColorScheme,
  PlaceFormValues,
  PlaceValues,
} from '../../../models';
import Button from '../../UI/Button';
import { GlobalStyles } from '../../../constants/styles';

interface PlaceFormProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitButtonLabel: string;
  defaultValues?: PlaceValues;
  isEditing?: boolean;
  editPlaceId?: number;
}

const PlaceForm: React.FC<PlaceFormProps> = ({
  onCancel,
  onSubmit,
  submitButtonLabel,
  defaultValues,
  isEditing,
  editPlaceId,
}): ReactElement => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputs, setInputs] = useState<PlaceFormValues>({
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

  function inputChangedHandler(inputIdentifier: string, enteredValue: string) {
    setInputs((currInputs) => {
      return {
        ...currInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true, errors: [] }, // dynamically use propertynames for objects
      };
    });
  }

  // async function validateInputs(): Promise<void> {
  //   // Set all errors to empty array to prevent stacking of errors
  //   setIsSubmitting(true);
  //   for (const key in inputs) {
  //     inputs[key as keyof PlaceFormValues].errors = [];
  //   }

  //   let response: InputValidationResponse;
  //   if (isEditing) {
  //     response = await updateJourney(inputs, editJourneyId!);
  //   } else if (!isEditing) {
  //     response = await createJourney(inputs);
  //   }

  //   const { error, status, journey, journeyFormValues } = response!;

  //   if (!error && journey) {
  //     onSubmit({ journey, status });
  //   } else if (error) {
  //     onSubmit({ error, status });
  //   } else if (journeyFormValues) {
  //     setInputs((prevValues) => journeyFormValues);
  //   }
  //   setIsSubmitting(false);
  //   return;
  // }

  if (isSubmitting) {
    const submitButtonLabel = 'Submitting...';
  }

  return (
    <View style={styles.formContainer}>
      <Text style={styles.header}>Place To Visit</Text>
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
            value: inputs.description.value,
            onChangeText: inputChangedHandler.bind(this, 'description'),
          }}
        />
        {/* TODO: Add Checkbox for visited and favorite */}
        <Input
          label='Link'
          invalid={!inputs.link.isValid}
          errors={inputs.link.errors}
          textInputConfig={{
            value: inputs.link.value,
            onChangeText: inputChangedHandler.bind(this, 'link'),
          }}
        />
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

export default PlaceForm;
