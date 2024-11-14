import { ReactElement, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { GlobalStyles } from '../../../constants/styles';
import { generateRandomString } from '../../../utils';

interface InputProps {
  label: string;
  style?: ViewStyle;
  textInputConfig?: TextInputProps;
  invalid: boolean;
  errors?: string[];
}

const Input: React.FC<InputProps> = ({
  label,
  style,
  textInputConfig,
  invalid,
  errors,
}): ReactElement => {
  const inputStyles: StyleProp<TextStyle>[] = [styles.input];
  const [isInvalid, setIsInvalid] = useState(false);

  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  if (invalid) {
    inputStyles.push(styles.invalidInput);
  }

  // console.log(textInputConfig?.value);
  if (
    textInputConfig &&
    (textInputConfig.value === undefined || !textInputConfig.value)
  ) {
    textInputConfig.value = '';
  }

  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={[styles.label, invalid && styles.invalidLabel]}>
        {label}
      </Text>
      <TextInput style={inputStyles} {...textInputConfig} />
      {errors &&
        errors.map((error) => (
          <Text key={generateRandomString()} style={styles.invalidInfo}>
            {error.replace(', ', '')}
          </Text>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: GlobalStyles.colors.primary400,
    marginBottom: 4,
  },
  input: {
    backgroundColor: GlobalStyles.colors.primary50,
    color: GlobalStyles.colors.primary400,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    marginVertical: 2,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  invalidLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GlobalStyles.colors.error500,
  },
  invalidInput: {
    backgroundColor: GlobalStyles.colors.error50,
  },
  invalidInfo: {
    color: GlobalStyles.colors.error500,
    fontSize: 14,
    fontStyle: 'italic',
    flexWrap: 'wrap',
  },
});

export default Input;
