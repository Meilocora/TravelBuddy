import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { UserProfileRouteProp } from '../models';
import InfoText from '../components/UI/InfoText';
import MainGradient from '../components/UI/LinearGradients/MainGradient';

interface UserProfileProps {
  route: UserProfileRouteProp;
}

// Countries Visited
// Journeys completed / planned
// MajorStages completed / planned
// MinorStages completed / planned
// Total costs / budget => money spent by category
// Total time spent travelling

const UserProfile: React.FC<UserProfileProps> = (): ReactElement => {
  return (
    <View style={styles.root}>
      <MainGradient />
      <View>
        <InfoText content='User Profile' />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default UserProfile;
