import React, { ReactElement, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { UserProfileRouteProp } from '../models';
import MainGradient from '../components/UI/LinearGradients/MainGradient';
import CurrentElementList from '../components/CurrentElements/CurrentElementList';
import { ScrollView } from 'react-native-gesture-handler';
import { StagesContext } from '../store/stages-context';
import UserSettings from '../components/UserProfile/UserSettings';
import UserStats from '../components/UserProfile/UserStats';

interface UserProfileProps {
  route: UserProfileRouteProp;
}

// TODO:
// Money Chart

// change username and password
// change ColorScheme,

const UserProfile: React.FC<UserProfileProps> = (): ReactElement => {
  const [showDetails, setShowDetails] = useState(true);

  const stagesCtx = useContext(StagesContext);
  const journeys = stagesCtx.journeys;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ flexGrow: 1 }}
      nestedScrollEnabled
    >
      <MainGradient />
      <CurrentElementList />
      <UserStats
        journeys={journeys}
        toggleVisivility={() => setShowDetails((prevValue) => !prevValue)}
        isVisible={showDetails}
      />
      <UserSettings />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default UserProfile;
