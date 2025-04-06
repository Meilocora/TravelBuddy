import { ReactElement } from 'react';
import { View, StyleSheet, LayoutAnimation } from 'react-native';

import { MinorStage } from '../../../models';
import ContentHeader from './ContentHeader';
import { GlobalStyles } from '../../../constants/styles';
import MainContent from './MainContent';
import { generateRandomString } from '../../../utils/generator';

interface ContenBoxProps {
  minorStage: MinorStage;
  journeyId: number;
  contentState: { activeHeader: string };
  setContentState: React.Dispatch<
    React.SetStateAction<{ activeHeader: string }>
  >;
}

const ContentBox: React.FC<ContenBoxProps> = ({
  journeyId,
  minorStage,
  contentState,
  setContentState,
}): ReactElement => {
  const handleOnPressHeader = (header: string) => {
    // TODO: Why this animation is not working?
    LayoutAnimation.configureNext({
      duration: 500,
      update: { type: 'spring', springDamping: 0.7 },
    });
    setContentState({ activeHeader: header.toLowerCase() });
  };

  let contentHeaders = ['Transport', 'Places', 'Activities', 'Spendings'];

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
      <MainContent
        journeyId={journeyId}
        minorStage={minorStage}
        contentState={contentState}
      />
    </>
  );
};

const styles = StyleSheet.create({
  contentHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
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
