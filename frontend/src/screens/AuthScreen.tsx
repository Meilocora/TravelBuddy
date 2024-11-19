import { ReactElement, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { AuthContext } from '../store/auth-context';
import { AuthFormValues } from '../models';
import MainHeader from '../components/UI/MainHeader';
import InfoText from '../components/UI/InfoText';
import AuthForm from '../components/Auth/AuthForm';

interface AuthScreenProps {}

const AuthScreen: React.FC<AuthScreenProps> = (): ReactElement => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler(authFormValues: AuthFormValues) {
    // setIsAuthenticating(true);
    // try {
    //   const token = await createUser(email, password);
    //   authCtx.authenticate(token);
    // } catch (error) {
    //   console.error(error);
    //   setIsAuthenticating(false);
    // }
    console.log(authFormValues);
  }

  if (isAuthenticating) {
    return <InfoText content='Logging you in...' />;
  }

  return (
    <View style={styles.root}>
      <MainHeader title='Travelbuddy' />
      <AuthForm onAuthenticate={loginHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default AuthScreen;
