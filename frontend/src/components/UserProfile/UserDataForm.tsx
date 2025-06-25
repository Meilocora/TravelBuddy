import { ReactElement, useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';

import { GlobalStyles } from '../../constants/styles';
import { ButtonMode, ColorScheme, Icons, Journey } from '../../models';
import { CustomCountryContext } from '../../store/custom-country-context';
import Button from '../UI/Button';
import { UserContext } from '../../store/user-context';

interface UserDataFormProps {}

const UserDataForm: React.FC<UserDataFormProps> = ({}): ReactElement => {
  const [showNameForm, setShowNameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const userCtx = useContext(UserContext);

  function handlePressEditName() {
    setShowNameForm(true);
    setShowPasswordForm(false);
  }

  function handlePressEditPassword() {
    setShowNameForm(false);
    setShowPasswordForm(true);
  }

  return (
    <View style={styles.container}>
      <Button
        colorScheme={ColorScheme.neutral}
        // mode={ButtonMode.flat}
        onPress={handlePressEditName}
        style={styles.button}
      >
        Edit Name
      </Button>
      <Button
        colorScheme={ColorScheme.neutral}
        // mode={ButtonMode.flat}
        onPress={handlePressEditPassword}
        style={styles.button}
      >
        Edit Password
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  button: { alignSelf: 'center' },
});

export default UserDataForm;
