import { ReactElement } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface TextLinkProps {
  link: string;
  style?: ViewStyle;
  children: string;
}

const TextLink: React.FC<TextLinkProps> = ({
  link,
  style,
  children,
}): ReactElement => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={() => Linking.openURL(link)}>
        <Text style={styles.text}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'blue',
  },
});

export default TextLink;
