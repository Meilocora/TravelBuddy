import { ReactElement, useState, useContext, useCallback } from 'react';
import { FlatList } from 'react-native';

import { fetchMajorStagesById } from '../../utils/http';
import { MajorStageContext } from '../../store/majorStage-context.';
import MajorStageListElement from './MajorStageListElement';
import InfoText from '../UI/InfoText';
import { useFocusEffect } from '@react-navigation/native';
import InfoCurtain from '../UI/InfoCurtain';
import { JourneyContext } from '../../store/journey-context';
import { ColorScheme } from '../../models';

interface MajorStageListProps {
  journeyId: number;
}

const MajorStageList: React.FC<MajorStageListProps> = ({
  journeyId,
}): ReactElement => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const journeyCtx = useContext(JourneyContext);
  const journey = journeyCtx.journeys.find((j) => j.id === journeyId);
  const majorStageCtx = useContext(MajorStageContext);

  const getMajorStages = useCallback(async (journeyId: number) => {
    setIsFetching(true);
    const response = await fetchMajorStagesById(journeyId);
    if (!response.error) {
      majorStageCtx.setMajorStages(response.majorStages || []);
    } else {
      setError(response.error);
    }
    setIsFetching(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getMajorStages(journeyId);
    }, [journeyId, getMajorStages])
  );

  if (isFetching) {
    return <InfoText content='Loading...' />;
  }

  if (majorStageCtx.majorStages.length === 0) {
    return <InfoText content='No major stages found!' />;
  }

  if (error) {
    return <InfoText content={error} />;
  }

  return (
    <>
      {journey?.description && (
        <InfoCurtain
          info={journey?.description}
          colorScheme={ColorScheme.accent}
        />
      )}
      <FlatList
        data={majorStageCtx.majorStages}
        renderItem={({ item, index }) => (
          <MajorStageListElement
            journeyId={journeyId}
            majorStage={item}
            index={index}
          />
        )}
      />
    </>
  );
};

export default MajorStageList;
