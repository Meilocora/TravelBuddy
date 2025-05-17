import { ReactElement, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Location, LocationType } from '../../../utils/http';
import { StagesContext } from '../../../store/stages-context';
import ActivityContent from './ActivityContent';

interface MapLocationElementProps {
  location: Location;
}

const MapLocationElement: React.FC<MapLocationElementProps> = ({
  location,
}): ReactElement => {
  const stagesCtx = useContext(StagesContext);

  let content: ReactElement;

  if (location.locationType === LocationType.placeToVisit) {
    const place = stagesCtx.findPlaceToVisit(
      location.minorStageName!,
      location.id!
    );
    content = <Text>Place To Visit</Text>;
  } else if (location.locationType === LocationType.accommodation) {
    const minorStage = stagesCtx.findMinorStage(location.id!);
    content = <Text>Minor Stage</Text>;
  } else if (location.locationType === LocationType.activity) {
    const contextResponse = stagesCtx.findActivity(
      location.minorStageName!,
      location.id!
    );
    content = (
      <ActivityContent
        activity={contextResponse?.activity!}
        minorStageId={contextResponse?.minorStageId!}
      />
    );
  } else if (
    location.locationType === LocationType.transportation_arrival ||
    location.locationType === LocationType.transportation_departure
  ) {
    if (!location.minorStageName) {
      const transportation = stagesCtx.findTransportation(location.belonging);
      content = <Text>Major Stage Transportation</Text>;
    } else if (location.minorStageName) {
      const transportation = stagesCtx.findTransportation(
        location.belonging,
        location.minorStageName
      );
      content = <Text>Minor Stage Transportation</Text>;
    }
  }

  return <View style={styles.container}>{content!}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
});

export default MapLocationElement;
