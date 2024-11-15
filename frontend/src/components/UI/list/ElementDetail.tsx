import { ReactElement } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ElementDetailProps {
  title: string;
  value: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const ElementDetail = ({
  title,
  value,
  style,
  textStyle,
}: ElementDetailProps): ReactElement => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, textStyle]}>{title}</Text>
      <Text style={textStyle}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 3,
    flexBasis: '50%',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ElementDetail;
