import { ReactElement } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface ElementTitleProps {
  children: string;
  style?: TextStyle;
}

const ElementTitle: React.FC<ElementTitleProps> = ({
  children,
  style,
}): ReactElement => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ElementTitle;
