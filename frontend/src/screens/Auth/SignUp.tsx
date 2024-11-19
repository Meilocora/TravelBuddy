import { ReactElement, useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { AuthContext } from '../../store/auth-context';
import { AuthFormValues } from '../../models';
import InfoText from '../../components/UI/InfoText';
import MainHeader from '../../components/UI/MainHeader';
import AuthForm from '../../components/Auth/AuthForm';
import Animated from 'react-native-reanimated';

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = (): ReactElement => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signUpHandler(authFormValues: AuthFormValues) {
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
    return <InfoText content='Creating user...' />;
  }

  return (
    <View>
      <Animated.View sharedTransitionTag='main-header'>
        <MainHeader title='Travelbuddy' />
      </Animated.View>
      <AuthForm onAuthenticate={signUpHandler} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default SignUp;
