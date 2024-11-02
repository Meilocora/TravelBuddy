import React, { ReactElement } from 'react';
import { Text, View } from 'react-native';
import { UserProfileRouteProp } from '../models';

interface UserProfileProps {
  route: UserProfileRouteProp;
}

const UserProfile: React.FC<UserProfileProps> = (): ReactElement => {
  return (
    <View>
      <Text>User Profile</Text>
    </View>
  );
};

export default UserProfile;
