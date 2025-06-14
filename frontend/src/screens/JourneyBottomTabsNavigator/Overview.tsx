import { ReactElement, useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { StagesContext } from '../../store/stages-context';
import DesctipionElement from '../../components/Overview/DescriptionElement';
import OverviewDetails from '../../components/Overview/OverviewDetails';

interface OverviewProps {}

const Overview: React.FC<OverviewProps> = (): ReactElement => {
  const stagesCtx = useContext(StagesContext);
  const journey = stagesCtx.findJourney(stagesCtx.selectedJourneyId!);

  // AREA Money Spent cake diagramm
  // Functionality => Check for gaps, missing transportation, missing accommodation

  return (
    <View style={styles.root}>
      {journey?.description && (
        <DesctipionElement description={journey.description} />
      )}
      <OverviewDetails journey={journey!} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default Overview;
