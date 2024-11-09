import { ReactElement } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { MinorStage } from '../../models';
import ElementTitle from '../UI/list/ElementTitle';
import ElementComment from '../UI/list/ElementComment';
import { formatDate } from '../../utils';
import { GlobalStyles } from '../../constants/styles';
import ContentBox from '../UI/contentbox/ContentBox';

interface MinorStageListElementProps {
  minorStage: MinorStage;
}

const MinorStageListElement: React.FC<MinorStageListElementProps> = ({
  minorStage,
}): ReactElement => {
  const startDate = formatDate(minorStage.scheduled_start_time);
  const endDate = formatDate(minorStage.scheduled_end_time);

  return (
    <View style={styles.container}>
      <ElementTitle style={styles.heading}>{minorStage.title}</ElementTitle>
      <ElementComment content={`${startDate} - ${endDate}`} />
      <ContentBox minorStage={minorStage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    backgroundColor: GlobalStyles.colors.complementary100,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: GlobalStyles.colors.complementary700,
  },
  heading: {
    fontSize: 16,
  },
});

export default MinorStageListElement;
