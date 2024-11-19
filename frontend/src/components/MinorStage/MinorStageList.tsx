import { ReactElement, useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';

import { fetchMinorStagesById } from '../../utils/http/minor_stage';
import { MinorStageContext } from '../../store/minorStage-context';
import MinorStageListElement from './MinorStageListElement';
import { generateRandomString } from '../../utils/generator';

interface MinorStageListProps {
  majorStageId: number;
}

const MinorStageList: React.FC<MinorStageListProps> = ({
  majorStageId,
}): ReactElement => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minorStageCtx = useContext(MinorStageContext);

  useEffect(() => {
    async function getMinorStages(majorStageId: number) {
      setIsFetching(true);
      const response = await fetchMinorStagesById(majorStageId);

      if (!response.error) {
        minorStageCtx.setMinorStages(response.minorStages || []);
      } else {
        setError(response.error);
      }
      setIsFetching(false);
    }

    getMinorStages(majorStageId);
  }, []);

  if (minorStageCtx.minorStages.length === 0 && !error) {
    return <Text>No minor stages found!</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <FlatList
      style={styles.container}
      data={minorStageCtx.minorStages}
      renderItem={({ item }) => (
        <MinorStageListElement key={generateRandomString()} minorStage={item} />
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginHorizontal: 'auto',
  },
});

export default MinorStageList;
