import { ReactElement, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { AuthContext } from '../store/auth-context';
import { AuthFormValues } from '../models';
import MainHeader from '../components/UI/MainHeader';
import InfoText from '../components/UI/InfoText';
import AuthForm from '../components/Auth/AuthForm';

interface AuthScreenProps {}

export interface AuthHandlerProps {
  token?: string;
  error?: string;
  status: number;
}

const AuthScreen: React.FC<AuthScreenProps> = (): ReactElement => {
  const [isLogin, setIsLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  async function authHandler({ token, error, status }: AuthHandlerProps) {
    // setIsAuthenticating(true);
    // try {
    //   const token = await createUser(email, password);
    //   authCtx.authenticate(token);
    // } catch (error) {
    //   console.error(error);
    //   setIsAuthenticating(false);
    // }
    console.log(token, status);
  }

  function switchAuthModeHandler() {
    setIsLogin((currValue) => !currValue);
    console.log(isLogin);
  }

  return (
    <View style={styles.root}>
      <MainHeader title='Travelbuddy' />
      <AuthForm
        onAuthenticate={authHandler}
        isLogin={isLogin}
        onSwitchMode={switchAuthModeHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default AuthScreen;
