import React, { ReactElement } from 'react';
import { Text, View } from 'react-native';
import { UserProfileRouteProp } from '../models';
import InfoText from '../components/UI/InfoText';

interface UserProfileProps {
  route: UserProfileRouteProp;
}

const UserProfile: React.FC<UserProfileProps> = (): ReactElement => {
  return (
    <View>
      <InfoText content='User Profile' />
    </View>
  );
};

export default UserProfile;
