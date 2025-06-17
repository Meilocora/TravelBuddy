import { ReactElement, useContext } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

import { StagesContext } from '../../store/stages-context';
import DesctipionElement from '../../components/Overview/DescriptionElement';
import OverviewDetails from '../../components/Overview/OverviewDetails';
import OverviewChart from '../../components/Overview/OverviewChart';
import Button from '../../components/UI/Button';
import { ButtonMode, ColorScheme } from '../../models';

interface OverviewProps {}

const Overview: React.FC<OverviewProps> = (): ReactElement => {
  const stagesCtx = useContext(StagesContext);
  const journey = stagesCtx.findJourney(stagesCtx.selectedJourneyId!);

  function handleCheckPlanning() {
    // TODO: Check for gaps between major and minor stages
    // Print everything found in a modal
  }

  return (
    <ScrollView style={styles.root}>
      {journey?.description && (
        <DesctipionElement description={journey.description} />
      )}
      <OverviewDetails journey={journey!} />
      <OverviewChart journey={journey!} />
      <Button
        colorScheme={ColorScheme.accent}
        onPress={() => {}}
        style={styles.button}
      >
        Check Planning
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  button: {
    alignSelf: 'flex-start',
    marginHorizontal: 'auto',
    marginTop: 10,
  },
});

export default Overview;
