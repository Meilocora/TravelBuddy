import { ReactElement, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { StagesContext } from '../../store/stages-context';

interface CurrentElementListProps {}

const CurrentElementList: React.FC<
  CurrentElementListProps
> = (): ReactElement => {
  const stagesCtx = useContext(StagesContext);

  const currentJourney = stagesCtx.journeys.find(
    (journey) => journey.currentJourney
  );

  if (!currentJourney) {
    const nextJourney = stagesCtx.findNextJourney();
    // TODO: Add CountdownElement
  }

  const currentMinorStage = stagesCtx.findCurrentMinorStage();
  // TODO: Link to current MinorStage
  // TODO: Link to current Accommodation => MapLink to ShowMap

  const nextTransportation = stagesCtx.findNextTransportation();
  // TODO: Countdown to next Transportation

  return <View></View>;
};

const styles = StyleSheet.create({});

export default CurrentElementList;
