import { ReactElement } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import TextLink from '../TextLink';
import { Icons } from '../../../models';
import IconButton from '../IconButton';

interface ElementDetailProps {
  title?: string;
  icon?: Icons;
  value: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  link?: string;
}

const ElementDetail = ({
  title,
  icon,
  value,
  style,
  textStyle,
  link,
}: ElementDetailProps): ReactElement => {
  return (
    <View style={[styles.container, style]}>
      {title ? (
        <Text style={[styles.title]} numberOfLines={1}>
          {title}
        </Text>
      ) : icon ? (
        <IconButton
          icon={icon}
          onPress={() => {}}
          color='black'
          containerStyle={styles.icon}
        />
      ) : undefined}
      {!link && (
        <Text style={textStyle} numberOfLines={1}>
          {value}
        </Text>
      )}
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
    marginTop: 10,
    marginHorizontal: 12,
    paddingVertical: 4,
    flexBasis: '40%',
    borderWidth: 0.75,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    marginVertical: 0,
    paddingVertical: 0,
  },
});

export default ElementDetail;
