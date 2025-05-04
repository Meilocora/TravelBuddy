import { ReactElement, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import MinorStageListElement from './MinorStageListElement';
import { generateRandomString } from '../../utils/generator';
import InfoCurtain from '../UI/InfoCurtain';
import { ColorScheme, MajorStage, MinorStage } from '../../models';

interface MinorStageListProps {
  majorStage: MajorStage;
  minorStages: MinorStage[];
}

const MinorStageList: React.FC<MinorStageListProps> = ({
  majorStage,
  minorStages,
}): ReactElement => {
  // TODO: This must be differentiated by the minorStages aswell!
  const [contentState, setContentState] = useState({
    activeHeader: 'transport',
  });

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
        data={minorStages}
        renderItem={({ item }) => (
          <MinorStageListElement
            key={generateRandomString()}
            minorStage={item}
            contentState={contentState}
            setContentState={setContentState}
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
