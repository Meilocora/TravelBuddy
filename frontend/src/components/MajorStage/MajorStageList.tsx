import { ReactElement, useEffect, useState, useContext } from 'react';
import { FlatList, Text, View } from 'react-native';

import { fetchMajorStageById } from '../../utils/http';
import { MajorStageContext } from '../../store/majorStage-context.';
import MajorStageListElement from './MajorStageListElement';

interface MajorStageListProps {
  journeyId: number;
}

const MajorStageList: React.FC<MajorStageListProps> = ({
  journeyId,
}): ReactElement => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const majorStageCtx = useContext(MajorStageContext);

  useEffect(() => {
    async function getMajorStages(journeyId: number) {
      setIsFetching(true);
      const response = await fetchMajorStageById(journeyId);
      if (!response.error) {
        majorStageCtx.setMajorStages(response.typedMajorStages || []);
      } else {
        setError(response.error);
      }
      setIsFetching(false);
    }

    getMajorStages(journeyId);
  }, []);

  if (isFetching) {
    return <Text>Loading...</Text>;
  }

  if (majorStageCtx.majorStages.length === 0) {
    return <Text>No major stages found!</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <FlatList
      data={majorStageCtx.majorStages}
      renderItem={({ item, index }) => (
        <MajorStageListElement majorStage={item} index={index} />
      )}
    />
  );
};

export default MajorStageList;
