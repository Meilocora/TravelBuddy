import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { UserProfileRouteProp } from '../models';
import InfoText from '../components/UI/InfoText';
import MainGradient from '../components/UI/LinearGradients/MainGradient';

interface UserProfileProps {
  route: UserProfileRouteProp;
}

const UserProfile: React.FC<UserProfileProps> = (): ReactElement => {
  return (
    <>
      <MainGradient />
      <View style={styles.root}>
        <InfoText content='User Profile' />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfile;
