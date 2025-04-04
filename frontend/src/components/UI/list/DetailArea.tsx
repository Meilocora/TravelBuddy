import { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { View } from 'react-native';

import ElementDetail from './ElementDetail';
import { generateRandomString } from '../../../utils/generator';

export interface ElementDetailInfo {
  title: string;
  value: string;
  textStyle?: TextStyle;
  link?: string;
}

interface DetailProps {
  areaStyle?: ViewStyle;
  detailStyle?: ViewStyle;
  elementDetailInfo: ElementDetailInfo[];
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
          link={info.link}
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
