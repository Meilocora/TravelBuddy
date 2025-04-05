import { ReactElement } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import TextLink from '../TextLink';

interface ElementDetailProps {
  title: string;
  value: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  link?: string;
}

const ElementDetail = ({
  title,
  value,
  style,
  textStyle,
  link,
}: ElementDetailProps): ReactElement => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title]}>{title}</Text>
      {!link && <Text style={textStyle}>{value}</Text>}
      {link && (
        <TextLink link={link} textStyle={textStyle}>
          {value}
        </TextLink>
      )}
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
