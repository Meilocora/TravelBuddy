import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { UserProfileRouteProp } from '../models';
import InfoText from '../components/UI/InfoText';
import MainGradient from '../components/UI/LinearGradients/MainGradient';
import CurrentElementList from '../components/CurrentElements/CurrentElementList';

interface UserProfileProps {
  route: UserProfileRouteProp;
}

// TODO:
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
      <CurrentElementList />
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
