import { ReactElement, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { AuthContext } from '../../store/auth-context';
import { AuthFormValues } from '../../models';
import InfoText from '../../components/UI/InfoText';
import AuthForm from '../../components/Auth/AuthForm';
import MainHeader from '../../components/UI/MainHeader';

interface LoginProps {}

const Login: React.FC<LoginProps> = (): ReactElement => {
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
    <View>
      <Animated.View sharedTransitionTag='main-header'>
        <MainHeader title='Travelbuddy' />
      </Animated.View>
      <AuthForm isLogin onAuthenticate={loginHandler} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Login;
