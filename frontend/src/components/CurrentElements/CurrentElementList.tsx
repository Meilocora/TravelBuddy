import { ReactElement, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { Indicators, StagesContext } from '../../store/stages-context';
import { formatAmount, formatCountdownDays } from '../../utils';
import CurrentElement from './CurrentElement';
import { JourneyBottomTabsParamsList, StackParamList } from '../../models';
import { LocationType, Location } from '../../utils/http';

interface CurrentElementListProps {}

const CurrentElementList: React.FC<
  CurrentElementListProps
> = (): ReactElement => {
  const journeyNavigation = useNavigation<NavigationProp<StackParamList>>();
  const minorStageNavigation =
    useNavigation<NativeStackNavigationProp<JourneyBottomTabsParamsList>>();
  const mapNavigation =
    useNavigation<NativeStackNavigationProp<StackParamList>>();

  const stagesCtx = useContext(StagesContext);

  const currentJourney = stagesCtx.journeys.find(
    (journey) => journey.currentJourney
  );
  const currentMinorStage = stagesCtx.findCurrentMinorStage();
  const currentMajorStage = stagesCtx.findMinorStagesMajorStage(
    currentMinorStage?.id || 1
  );
  const nextTransportation = stagesCtx.findNextTransportation();
  const nextJourney = stagesCtx.findNextJourney();

  let content: ReactElement = <Text>No Information</Text>;

  function handleGoToNextJourney() {
    stagesCtx.setSelectedJourneyId(nextJourney!.id);
    journeyNavigation.navigate('JourneyBottomTabsNavigator', {
      screen: 'Planning',
      params: { journeyId: nextJourney!.id },
    });
  }

  function handleGoToMinorStage() {
    minorStageNavigation.navigate('MajorStageStackNavigator', {
      screen: 'MinorStages',
      params: {
        journeyId: currentJourney!.id,
        majorStageId: currentMinorStage!.id,
      },
    });
  }

  function handleShowLocation() {
    const location: Location = {
      belonging: 'Undefined',
      locationType: LocationType.accommodation,
      data: {
        name: currentMinorStage?.accommodation.place || '',
        latitude: currentMinorStage?.accommodation.latitude!,
        longitude: currentMinorStage?.accommodation.longitude!,
      },
    };

    mapNavigation.navigate('ShowMap', {
      location: location,
      colorScheme: 'complementary',
    });
  }

  if (!currentJourney) {
    if (nextJourney) {
      const countDown = formatCountdownDays(nextJourney!.scheduled_start_time);
      const description = `Starts in ${countDown} days`;

      content = (
        <CurrentElement
          title={nextJourney!.name}
          subtitle='Next Journey'
          description={description}
          indicator={Indicators.nextJourney}
          onPress={() => handleGoToNextJourney}
        />
      );
    }
  } else {
    const duration = formatCountdownDays(currentMinorStage!.scheduled_end_time);
    content = (
      <>
        {currentMinorStage && (
          <>
            <CurrentElement
              title={currentMinorStage!.title}
              subtitle='Current Minor Stage'
              description={`${
                currentMajorStage!.country.name
              } for ${duration} days`}
              indicator={Indicators.currentMinorStage}
              onPress={() => handleGoToMinorStage}
            />
            <CurrentElement
              title={currentMinorStage!.accommodation.place}
              subtitle='Current Accommodation'
              description={formatAmount(currentMinorStage.accommodation.costs)}
              indicator={Indicators.currentAccommodation}
              onPress={() => handleShowLocation}
            />
          </>
        )}
      </>
    );

    // TODO: Countdown to next Transportation
  }

  return <View style={styles.container}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 5,
    zIndex: 2,
  },
});

export default CurrentElementList;
