import { ReactElement, useState } from 'react';
import { View, StyleSheet, LayoutAnimation } from 'react-native';

import { MinorStage } from '../../../models';
import ContentHeader from './ContentHeader';
import { GlobalStyles } from '../../../constants/styles';

interface ContenBoxProps {
  minorStage: MinorStage;
}

const ContentBox: React.FC<ContenBoxProps> = ({ minorStage }): ReactElement => {
  const [contentState, setContentState] = useState({ activeHeader: 'costs' });

  // function handleOnPressHeader(header: string) {
  //   setContentState({ activeHeader: header.toLowerCase() });
  // }

  const handleOnPressHeader = (header: string) => {
    LayoutAnimation.spring();
    setContentState({ activeHeader: header.toLowerCase() });
  };

  const contentHeaders = ['Costs'];

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
    <View style={styles.contentContainer}>
      {contentHeaders.map((header) => {
        return (
          <ContentHeader
            onPress={handleOnPressHeader}
            title={header}
            key={header}
            headerStyle={
              contentState.activeHeader === header.toLowerCase()
                ? styles.activeHeader
                : null
            }
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  activeHeader: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeContainer: {
    backgroundColor: GlobalStyles.colors.complementary100,
  },
});

export default ContentBox;
