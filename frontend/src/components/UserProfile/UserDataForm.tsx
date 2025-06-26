import { ReactElement, ReactNode, useContext, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  SlideInUp,
  SlideOutUp,
} from 'react-native-reanimated';

import { GlobalStyles } from '../../constants/styles';
import {
  ButtonMode,
  ColorScheme,
  Icons,
  Journey,
  NameChangeFormValues,
  PasswordChangeFormValues,
} from '../../models';
import { CustomCountryContext } from '../../store/custom-country-context';
import Button from '../UI/Button';
import { UserContext } from '../../store/user-context';
import { AuthContext } from '../../store/auth-context';
import Input from '../UI/form/Input';
import IconButton from '../UI/IconButton';

interface UserDataFormProps {}

const UserDataForm: React.FC<UserDataFormProps> = ({}): ReactElement => {
  const [showNameForm, setShowNameForm] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [nameInputs, setNameInputs] = useState<NameChangeFormValues>({
    newUsername: { value: '', isValid: true, errors: [] },
    password: { value: '', isValid: true, errors: [] },
  });
  const [passwordInputs, setPasswordInputs] =
    useState<PasswordChangeFormValues>({
      newPassword: { value: '', isValid: true, errors: [] },
      confirmPassword: { value: '', isValid: true, errors: [] },
      oldPassword: { value: '', isValid: true, errors: [] },
    });

  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  function handlePressEditName() {
    setShowNameForm(true);
    setShowPasswordForm(false);
  }

  function handlePressEditPassword() {
    setShowNameForm(false);
    setShowPasswordForm(true);
  }

  function inputChangedHandler(
    formType: 'name' | 'password',
    inputIdentifier: string,
    enteredValue: string
  ) {
    if (formType === 'name') {
      setNameInputs((currInputs) => ({
        ...currInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true, errors: [] },
      }));
    } else if (formType === 'password') {
      setPasswordInputs((currInputs) => ({
        ...currInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true, errors: [] },
      }));
    }
  }

  // Get screen width and height
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  let content: ReactNode | undefined;

  if (showNameForm) {
    content = (
      <View
        style={[
          styles.blurContainer,
          { width: screenWidth, height: screenHeight * 1.25 },
        ]}
      >
        <Animated.View
          style={styles.formContainer}
          entering={FadeInDown}
          exiting={FadeOutUp}
        >
          <View style={styles.formRow}>
            <Input
              label='New Username'
              invalid={!nameInputs.newUsername.isValid}
              errors={nameInputs.newUsername.errors}
              textInputConfig={{
                value: nameInputs.newUsername.value,
                onChangeText: inputChangedHandler.bind(
                  this,
                  'name',
                  'newUsername'
                ),
                placeholder: authCtx.username!,
              }}
            />
          </View>
          <View style={styles.formRow}>
            <Input
              label='Password'
              invalid={!nameInputs.password.isValid}
              errors={nameInputs.password.errors}
              textInputConfig={{
                value: nameInputs.password.value,
                onChangeText: inputChangedHandler.bind(
                  null,
                  'name',
                  'password'
                ),
                secureTextEntry: hidePassword,
              }}
            />
            <IconButton
              icon={hidePassword ? Icons.eyeOff : Icons.eyeOn}
              onPress={() => setHidePassword((prevValue) => !prevValue)}
              style={{ marginTop: 22 }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => setShowNameForm(false)}
              colorScheme={ColorScheme.neutral}
              mode={ButtonMode.flat}
              style={styles.formButton}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {}}
              colorScheme={ColorScheme.neutral}
              style={styles.formButton}
            >
              Submit
            </Button>
          </View>
        </Animated.View>
      </View>
    );
  }

  // TODO: Make form for password change
  // Validation function
  // http request
  // backend

  return (
    <View style={styles.container}>
      <Button
        colorScheme={ColorScheme.neutral}
        onPress={handlePressEditName}
        style={styles.button}
      >
        Edit Name
      </Button>
      <Button
        colorScheme={ColorScheme.neutral}
        onPress={handlePressEditPassword}
        style={styles.button}
      >
        Edit Password
      </Button>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  button: { alignSelf: 'center' },
  blurContainer: {
    top: -250,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(34, 28, 48, 0.7)',
    alignSelf: 'stretch',
    zIndex: 1,
  },
  formContainer: {
    width: '80%',
    backgroundColor: GlobalStyles.colors.gray500,
    borderRadius: 20,
    borderWidth: 1,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '85%',
    marginVertical: 4,
    marginHorizontal: 'auto',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  formButton: {
    alignSelf: 'center',
    marginBottom: 15,
  },
});

export default UserDataForm;
