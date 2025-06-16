import { ReactElement, useContext } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

import { StagesContext } from '../../store/stages-context';
import DesctipionElement from '../../components/Overview/DescriptionElement';
import OverviewDetails from '../../components/Overview/OverviewDetails';
import OverviewChart from '../../components/Overview/OverviewChart';

interface OverviewProps {}

const Overview: React.FC<OverviewProps> = (): ReactElement => {
  const stagesCtx = useContext(StagesContext);
  const journey = stagesCtx.findJourney(stagesCtx.selectedJourneyId!);

  // Functionality => Check for gaps, missing transportation, missing accommodation

  return (
    <ScrollView style={styles.root}>
      {journey?.description && (
        <DesctipionElement description={journey.description} />
      )}
      <OverviewDetails journey={journey!} />
      <OverviewChart journey={journey!} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default Overview;
