import { ReactElement, useState } from 'react';
import { View, StyleSheet, LayoutAnimation } from 'react-native';

import { MinorStage } from '../../../models';
import ContentHeader from './ContentHeader';
import { GlobalStyles } from '../../../constants/styles';
import MainContent from './MainContent';
import { generateRandomString } from '../../../utils/generator';

interface ContenBoxProps {
  minorStage: MinorStage;
}

const ContentBox: React.FC<ContenBoxProps> = ({ minorStage }): ReactElement => {
  const [contentState, setContentState] = useState({ activeHeader: 'costs' });

  const handleOnPressHeader = (header: string) => {
    LayoutAnimation.configureNext({
      duration: 500,
      update: { type: 'spring', springDamping: 0.7 },
    });
    setContentState({ activeHeader: header.toLowerCase() });
  };

  let contentHeaders = ['Costs'];

  if (minorStage.baseLocation) {
    contentHeaders.push('Accommodation');
  }

  if (minorStage.placesToVisit) {
    contentHeaders.push('Places');
  }

  if (minorStage.activities) {
    contentHeaders.push('Activities');
  }

  return (
    <>
      <View style={styles.contentHeaderContainer}>
        {contentHeaders.map((header) => {
          return (
            <ContentHeader
              onPress={handleOnPressHeader}
              title={header}
              key={generateRandomString()}
              headerStyle={
                contentState.activeHeader === header.toLowerCase()
                  ? styles.activeHeader
                  : {}
              }
            />
          );
        })}
      </View>
      <MainContent minorStage={minorStage} contentState={contentState} />
    </>
  );
};

const styles = StyleSheet.create({
  contentHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: GlobalStyles.colors.complementary200,
  },
  activeHeader: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeContainer: {
    backgroundColor: GlobalStyles.colors.complementary100,
  },
});

export default ContentBox;
