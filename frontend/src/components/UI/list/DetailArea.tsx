import { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { View } from 'react-native';

import ElementDetail from './ElementDetail';
import { generateRandomString } from '../../../utils/generator';

interface DetailProps {
  areaStyle?: ViewStyle;
  detailStyle?: ViewStyle;
  elementDetailInfo: { title: string; value: string; textStyle?: TextStyle }[];
}

const DetailArea: React.FC<DetailProps> = ({
  areaStyle,
  detailStyle,
  elementDetailInfo,
}): ReactElement => {
  return (
    <View style={[styles.detailsContainer, areaStyle]}>
      {elementDetailInfo.map((info) => (
        <ElementDetail
          key={generateRandomString()}
          title={info.title}
          value={info.value}
          style={detailStyle}
          textStyle={info.textStyle}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingTop: 6,
    width: '90%',
  },
});

export default DetailArea;
