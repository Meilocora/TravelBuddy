import { ReactElement } from 'react';
import { FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import MajorStageListElement from './MajorStageListElement';
import InfoCurtain from '../UI/InfoCurtain';
import { ColorScheme, Journey, MajorStage } from '../../models';

interface MajorStageListProps {
  journey: Journey;
  majorStages: MajorStage[];
}

const MajorStageList: React.FC<MajorStageListProps> = ({
  journey,
  majorStages,
}): ReactElement => {
  return (
    <>
      {journey?.description && (
        <InfoCurtain
          info={journey?.description}
          colorScheme={ColorScheme.accent}
        />
      )}
      <FlatList
        data={majorStages}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 200).duration(500)}>
            <MajorStageListElement
              journeyId={journey.id}
              majorStage={item}
              index={index}
            />
          </Animated.View>
        )}
      />
    </>
  );
};

export default MajorStageList;
