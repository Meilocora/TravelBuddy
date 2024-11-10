import { ReactElement, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  ButtonMode,
  ColorScheme,
  JourneyFormValues,
  JourneyValues,
} from '../../models';
import Input from '../UI/form/Input';
import { GlobalStyles } from '../../constants/styles';
import Button from '../UI/Button';
import { formatDate } from '../../utils';

interface JourneyFormProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitButtonLabel: string;
  defaultValues?: JourneyValues;
}

const JourneyForm: React.FC<JourneyFormProps> = ({
  onCancel,
  onSubmit,
  submitButtonLabel,
  defaultValues,
}): ReactElement => {
  const [inputs, setInputs] = useState<JourneyFormValues>({
    name: { value: defaultValues?.name || '', isValid: true },
    description: { value: defaultValues?.description || '', isValid: true },
    available_money: {
      value: defaultValues?.available_money || 0,
      isValid: true,
    },
    planned_costs: { value: defaultValues?.planned_costs || 0, isValid: true },
    scheduled_start_time: {
      value: defaultValues?.scheduled_start_time || null,
      isValid: true,
    },
    scheduled_end_time: {
      value: defaultValues?.scheduled_end_time || null,
      isValid: true,
    },
    countries: { value: defaultValues?.countries || [], isValid: true },
  });

  function inputChangedHandler(inputIdentifier: string, enteredValue: string) {
    setInputs((currInputs) => {
      return {
        ...currInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true }, // dynamically use propertynames for objects
      };
    });
  }

  return (
    <View style={styles.formContainer}>
      <Text style={styles.header}>Your Journey</Text>
      <View>
        <Input
          label='Name'
          invalid={!inputs.name.isValid}
          textInputConfig={{
            value: inputs.name.value,
            onChangeText: inputChangedHandler.bind(this, 'name'),
          }}
        />
        <Input
          label='Description'
          invalid={!inputs.description.isValid}
          textInputConfig={{
            multiline: true,
            value: inputs.description.value,
            onChangeText: inputChangedHandler.bind(this, 'description'),
          }}
        />
        <View style={styles.formRow}>
          <Input
            label='Available Money'
            invalid={!inputs.available_money.isValid}
            textInputConfig={{
              keyboardType: 'decimal-pad',
              value: inputs.available_money.value.toString(),
              onChangeText: inputChangedHandler.bind(this, 'available_money'),
            }}
          />
          <Input
            label='Planned Costs'
            invalid={!inputs.planned_costs.isValid}
            textInputConfig={{
              readOnly: true,
              value: inputs.planned_costs.value.toString(),
            }}
          />
        </View>
        <View style={styles.formRow}>
          <Input
            label='Starts on'
            invalid={!inputs.scheduled_start_time.isValid}
            textInputConfig={{
              placeholder: 'YYYY-MM-DD',
              maxLength: 10,
              value: inputs.scheduled_start_time.value
                ? formatDate(inputs.scheduled_start_time.value)
                : '',
              onChangeText: inputChangedHandler.bind(
                this,
                'scheduled_start_time'
              ),
            }}
          />
          <Input
            label='Ends on'
            invalid={!inputs.scheduled_end_time.isValid}
            textInputConfig={{
              placeholder: 'YYYY-MM-DD',
              maxLength: 10,
              value: inputs.scheduled_end_time.value!
                ? formatDate(inputs.scheduled_end_time.value)
                : '',
              onChangeText: inputChangedHandler.bind(
                this,
                'scheduled_end_time'
              ),
            }}
          />
        </View>
        <Input
          label='Countries'
          invalid={!inputs.countries.isValid}
          textInputConfig={{
            placeholder: 'Country1, Country2, ...',
            value: inputs.countries.value.toString(),
            onChangeText: inputChangedHandler.bind(this, 'countries'),
          }}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          onPress={onCancel}
          colorScheme={ColorScheme.primary}
          mode={ButtonMode.flat}
        >
          Cancel
        </Button>
        <Button onPress={onSubmit} colorScheme={ColorScheme.primary}>
          Submit
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: GlobalStyles.colors.primary500,
    backgroundColor: GlobalStyles.colors.gray50,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
  },
  header: {
    fontSize: 22,
    textAlign: 'center',
    color: GlobalStyles.colors.primary700,
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
