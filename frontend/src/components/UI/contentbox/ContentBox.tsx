import { ReactElement, useContext } from 'react';
import { View, StyleSheet, LayoutAnimation } from 'react-native';

import { MinorStage } from '../../../models';
import ContentHeader from './ContentHeader';
import { GlobalStyles } from '../../../constants/styles';
import MainContent from './MainContent';
import { generateRandomString } from '../../../utils/generator';
import { MinorStageContext } from '../../../store/minorStage-context';
import { parseDate } from '../../../utils';

interface ContenBoxProps {
  minorStage: MinorStage;
  majorStageId: number;
  journeyId: number;
}

const ContentBox: React.FC<ContenBoxProps> = ({
  journeyId,
  majorStageId,
  minorStage,
}): ReactElement => {
  const minorStageCtx = useContext(MinorStageContext);
  const isOver = parseDate(minorStage.scheduled_end_time) < new Date();

  const handleOnPressHeader = (header: string) => {
    LayoutAnimation.configureNext({
      duration: 500,
      update: { type: 'spring', springDamping: 0.7 },
    });
    minorStageCtx.setActiveHeaderHandler(minorStage.id, header.toLowerCase());
  };

  let contentHeaders = ['Transport', 'Places', 'Activities', 'Spendings'];

  return (
    <>
      <View
        style={[
          styles.contentHeaderContainer,
          isOver && styles.inactiveContentHeaderContainer,
        ]}
      >
        {contentHeaders.map((header) => {
          return (
            <ContentHeader
              onPress={handleOnPressHeader}
              title={header}
              key={generateRandomString()}
              headerStyle={
                minorStageCtx.activeHeader.minorStageId === minorStage.id &&
                minorStageCtx.activeHeader.header === header.toLowerCase()
                  ? styles.activeHeader
                  : {}
              }
            />
          );
        })}
      </View>
      <MainContent
        journeyId={journeyId}
        majorStageId={majorStageId}
        minorStage={minorStage}
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
  inactiveContentHeaderContainer: {
    borderBottomColor: GlobalStyles.colors.gray200,
  },
  activeHeader: {
    color: GlobalStyles.colors.complementary800,
    fontWeight: 'bold',
    fontSize: 18,
  },
  activeContainer: {
    backgroundColor: GlobalStyles.colors.complementary100,
  },
});

export default ContentBox;
