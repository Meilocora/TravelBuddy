import { ReactElement } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface ElementDetailProps {
  title: string;
  value: string;
  style?: ViewStyle;
}

const ElementDetail = ({
  title,
  value,
  style,
}: ElementDetailProps): ReactElement => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 3,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ElementDetail;
