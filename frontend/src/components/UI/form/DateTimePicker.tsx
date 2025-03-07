import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';

import Input from './Input';
import { formatDate, parseDate, parseDateAndTime } from '../../../utils';

interface PickerValues {
  inputIdentifier: string;
  selectedDate: Date | undefined;
}

interface DatePickerProps {
  openDatePicker: boolean;
  setOpenDatePicker: () => void;
  handleChange: (inputIdentifier: string, value: string) => void;
  inputIdentifier: string;
  invalid: boolean;
  errors: string[];
  value: string | undefined;
  label: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DateTimePicker: React.FC<DatePickerProps> = ({
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
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  console.log(openDatePicker);
  console.log(openTimePicker);

  function handleChooseDate({ inputIdentifier, selectedDate }: PickerValues) {
    if (selectedDate === undefined) {
      return;
    }
    setFormattedDate(formatDate(new Date(selectedDate)));
    setOpenTimePicker(true);
  }

  function handleChooseTime({ inputIdentifier, selectedDate }: PickerValues) {
    if (selectedDate === undefined) {
      return;
    }
    const formattedTime = selectedDate?.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    setOpenTimePicker(false);
    const responseDate = `${formattedDate} ${formattedTime}`;
    handleChange(inputIdentifier, responseDate);
  }

  return (
    <>
      <Pressable onPress={setOpenDatePicker}>
        <Input
          label={label}
          invalid={invalid}
          errors={errors}
          mandatory
          textInputConfig={{
            placeholder: 'Choose Date',
            readOnly: true,
            value: value,
          }}
        />
      </Pressable>
      {openDatePicker && !openTimePicker && (
        <RNDateTimePicker
          value={value ? parseDateAndTime(value) : new Date()}
          minimumDate={minimumDate || new Date()}
          maximumDate={maximumDate || undefined}
          mode='date'
          display='calendar'
          onChange={(event, selectedDate) => {
            if (event.type === 'dismissed') {
              return;
            } else {
              handleChooseDate({ inputIdentifier, selectedDate });
            }
          }}
        />
      )}
      {openDatePicker && openTimePicker && (
        <RNDateTimePicker
          value={value ? parseDateAndTime(value) : new Date()}
          minimumDate={minimumDate || new Date()}
          maximumDate={maximumDate || undefined}
          mode='time'
          display='spinner'
          onChange={(event, selectedDate) => {
            if (event.type === 'dismissed') {
              return;
            } else {
              handleChooseTime({ inputIdentifier, selectedDate });
            }
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({});

export default DateTimePicker;
