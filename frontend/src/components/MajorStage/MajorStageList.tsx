import { ReactElement, useState, useContext, useCallback } from 'react';
import { FlatList } from 'react-native';

import { fetchMajorStagesById } from '../../utils/http';
import { MajorStageContext } from '../../store/majorStage-context.';
import MajorStageListElement from './MajorStageListElement';
import InfoText from '../UI/InfoText';
import { useFocusEffect } from '@react-navigation/native';
import InfoCurtain from '../UI/InfoCurtain';
import { JourneyContext } from '../../store/journey-context';
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
          <MajorStageListElement
            journeyId={journey.id}
            majorStage={item}
            index={index}
          />
        )}
      />
    </>
  );
};

export default MajorStageList;
