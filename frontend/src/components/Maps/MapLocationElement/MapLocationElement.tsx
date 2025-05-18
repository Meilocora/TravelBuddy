import { ReactElement, useContext } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Location, LocationType } from '../../../utils/http';
import { StagesContext } from '../../../store/stages-context';
import ActivityContent from './ActivityContent';
import Animated, {
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

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
  },
});

export default MapLocationElement;
