import { ReactElement, useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';

import { fetchMinorStagesById } from '../../utils/http/minor_stage';
import { MinorStageContext } from '../../store/minorStage-context';
import MinorStageListElement from './MinorStageListElement';
import { generateRandomString } from '../../utils/generator';
import InfoText from '../UI/InfoText';
import { MajorStageContext } from '../../store/majorStage-context.';
import InfoCurtain from '../UI/InfoCurtain';
import { ColorScheme } from '../../models';

interface MinorStageListProps {
  majorStageId: number;
}

const MinorStageList: React.FC<MinorStageListProps> = ({
  majorStageId,
}): ReactElement => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minorStageCtx = useContext(MinorStageContext);
  const majorStageCtx = useContext(MajorStageContext);
  const majorStage = majorStageCtx.majorStages.find(
    (majorStage) => majorStage.id === majorStageId
  );

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
    return <InfoText content='No minor stages found!' />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <>
      {majorStage?.additional_info && (
        <InfoCurtain
          info={majorStage?.additional_info}
          colorScheme={ColorScheme.complementary}
        />
      )}
      <FlatList
        style={styles.container}
        data={minorStageCtx.minorStages}
        renderItem={({ item }) => (
          <MinorStageListElement
            key={generateRandomString()}
            minorStage={item}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </>
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
