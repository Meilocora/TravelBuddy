import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';

import Input from './Input';
import { parseDate } from '../../../utils';

interface DatePickerProps {
  openDatePicker: boolean;
  setOpenDatePicker: () => void;
  handleChange: (inputIdentifier: string, value: Date) => void;
  inputIdentifier: string;
  invalid: boolean;
  errors: string[];
  value: string | undefined;
  label: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  openDatePicker,
  setOpenDatePicker,
  handleChange,
  inputIdentifier,
  invalid,
  errors,
  value,
  label,
  minimumDate,
  maximumDate,
}) => {
  return (
    <>
      <Pressable onPress={setOpenDatePicker}>
        <Input
          label={label}
          invalid={invalid}
          errors={errors}
          textInputConfig={{
            placeholder: 'Choose Date',
            readOnly: true,
            value: value?.toString(),
          }}
        />
      </Pressable>
      {openDatePicker && (
        <RNDateTimePicker
          value={value ? parseDate(value) : new Date()}
          minimumDate={minimumDate || new Date()}
          maximumDate={maximumDate || undefined}
          mode='date'
          display='calendar'
          onChange={(event, selectedDate) => {
            if (event.type === 'dismissed') {
              return;
            } else {
              handleChange(inputIdentifier, selectedDate!);
            }
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({});

export default DatePicker;