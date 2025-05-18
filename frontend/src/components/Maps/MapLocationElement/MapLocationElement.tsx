import { ReactElement, useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { Location, LocationType } from '../../../utils/http';
import { StagesContext } from '../../../store/stages-context';
import ActivityContent from './ActivityContent';
import TransportationContent from './TransportationContent';

interface MapLocationElementProps {
  location: Location;
  onClose: () => void;
}

const DISMISS_THRESHOLD = 100;

const MapLocationElement: React.FC<MapLocationElementProps> = ({
  location,
  onClose,
}): ReactElement => {
  const stagesCtx = useContext(StagesContext);

  let content: ReactElement;

  if (location.locationType === LocationType.placeToVisit) {
    const place = stagesCtx.findPlaceToVisit(
      location.minorStageName!,
      location.id!
    );
    // TODO: Add placeContent
    content = <Text>Place To Visit</Text>;
  } else if (location.locationType === LocationType.accommodation) {
    const minorStage = stagesCtx.findMinorStage(location.id!);
    // TODO: Add accommodationContent
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
    const contextResponse = stagesCtx.findTransportation(
      location.belonging,
      location.minorStageName
    );
    content = (
      <TransportationContent
        minorStageId={contextResponse?.minorStageId}
        majorStageId={contextResponse?.majorStageId}
        transportation={contextResponse?.transportation!}
      />
    );
  }

  // Drag-to-dismiss logic
  // TODO: Use this for ErrorComponent aswell
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_THRESHOLD) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[styles.container, animatedStyle]}
        entering={SlideInDown}
        exiting={SlideOutDown}
      >
        {content!}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
});

export default MapLocationElement;
