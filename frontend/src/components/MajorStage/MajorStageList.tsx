import {
  ReactElement,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import { FlatList, Text } from 'react-native';

import { fetchMajorStagesById } from '../../utils/http';
import { MajorStageContext } from '../../store/majorStage-context.';
import MajorStageListElement from './MajorStageListElement';
import InfoText from '../UI/InfoText';
import { useFocusEffect } from '@react-navigation/native';

interface MajorStageListProps {
  journeyId: number;
}

const MajorStageList: React.FC<MajorStageListProps> = ({
  journeyId,
}): ReactElement => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  );
};

export default MajorStageList;
