import React, { ReactElement, useState } from 'react';
import { Text, View } from 'react-native';
import { UserProfileRouteProp } from '../models';
import SearchElement from '../components/UI/search/SearchElement';

interface UserProfileProps {
  route: UserProfileRouteProp;
}

const UserProfile: React.FC<UserProfileProps> = (): ReactElement => {
  return (
    <View>
      <SearchElement />
    </View>
  );
};

export default UserProfile;
