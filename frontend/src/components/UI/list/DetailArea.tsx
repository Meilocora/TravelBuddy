import { ReactElement } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { View } from 'react-native';

import ElementDetail from './ElementDetail';

interface DetailProps {
  areaStyle?: ViewStyle;
  detailStyle?: ViewStyle;
  elementDetailInfo: { title: string; value: string }[];
}

const DetailArea: React.FC<DetailProps> = ({
  areaStyle,
  detailStyle,
  elementDetailInfo,
}): ReactElement => {
  return (
    <View style={[styles.detailsContainer, areaStyle]}>
      {elementDetailInfo.map((info, index) => (
        <ElementDetail
          key={index}
          title={info.title}
          value={info.value}
          style={detailStyle}
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
