import { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import {
  AuthFormValues,
  ButtonMode,
  ColorScheme,
  Icons,
  StackParamList,
} from '../../models';
import FormShell from '../UI/form/FormShell';
import Button from '../UI/Button';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Input from '../UI/form/Input';
import IconButton from '../UI/IconButton';

interface AuthFormProps {
  isLogin?: boolean;
  onSwitchMode: () => void;
  onAuthenticate: (authFormValues: AuthFormValues) => void;
}

enum AuthMode {
  Login = 'Login',
  SignUp = 'SignUp',
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  onSwitchMode,
  onAuthenticate,
}): ReactElement => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.Login);
  const [hidePassword, setHidePassword] = useState(true);

  const [credential, setCredentials] = useState<AuthFormValues>({
    email: { value: '', isValid: true, errors: [] },
    username: { value: '', isValid: true, errors: [] },
    password: { value: '', isValid: true, errors: [] },
  });

  function handlePressIcon() {
    setHidePassword((currHidePassword) => !currHidePassword);
    // trigger rerender of password input to show/hide password
    setCredentials((currCredentials) => {
      return {
        ...currCredentials,
        password: { ...currCredentials.password, isValid: true, errors: [] },
      };
    });
  }

  let formContent = (
    <View>
      <View style={styles.formRow}>
        <Input
          label='E-Mail'
          invalid={!credential.email.isValid}
          errors={credential.email.errors}
          textInputConfig={{
            value: credential.email.value,
            onChangeText: inputChangedHandler.bind(null, 'email'),
          }}
        />
      </View>
      <View style={styles.formRow}>
        <Input
          label='Password'
          invalid={!credential.password.isValid}
          errors={credential.password.errors}
          textInputConfig={{
            value: credential.password.value,
            onChangeText: inputChangedHandler.bind(null, 'password'),
            secureTextEntry: hidePassword,
          }}
        />
        <IconButton
          icon={hidePassword ? Icons.eyeOff : Icons.eyeOn}
          onPress={handlePressIcon}
          style={{ marginTop: 22 }}
        />
      </View>
    </View>
  );

  if (authMode === AuthMode.SignUp) {
    formContent = (
      <>
        <View style={styles.formRow}>
          <Input
            label='Username'
            invalid={!credential.username.isValid}
            errors={credential.username.errors}
            textInputConfig={{
              value: credential.username.value,
              onChangeText: inputChangedHandler.bind(null, 'username'),
            }}
          />
        </View>
        {formContent}
      </>
    );
  }

  // function switchAuthModeHandler() {
  //   setAuthMode((currAuthMode) => {
  //     if (currAuthMode === AuthMode.Login) {
  //       return AuthMode.SignUp;
  //     } else {
  //       return AuthMode.Login;
  //     }
  //   });
  // }

  function submitHandler() {
    return;
  }

  async function validateInputs(): Promise<void> {
    return;
  }

  function inputChangedHandler(inputIdentifier: string, enteredValue: string) {
    setCredentials((currCredentials) => {
      return {
        ...currCredentials,
        [inputIdentifier]: { value: enteredValue, isValid: true, errors: [] }, // dynamically use propertynames for objects
      };
    });
  }

  return (
    <Animated.View style={styles.container} layout={FadeInUp.duration(300)}>
      <FormShell title={authMode.toString()}>
        {formContent}
        <View style={styles.buttonsContainer}>
          <Button
            onPress={onSwitchMode}
            colorScheme={ColorScheme.neutral}
            mode={ButtonMode.flat}
          >
            {authMode === AuthMode.Login
              ? 'Switch to SignUp'
              : 'Switch to Login'}
          </Button>
          <Button onPress={validateInputs} colorScheme={ColorScheme.neutral}>
            {authMode.toString()}
          </Button>
        </View>
      </FormShell>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 84,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    marginVertical: 4,
    marginHorizontal: 'auto',
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '80%',
    marginVertical: 8,
    marginHorizontal: 'auto',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

export default AuthForm;
