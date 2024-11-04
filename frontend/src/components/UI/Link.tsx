import { ReactElement } from 'react';
import {
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LinkProps {
  link: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const Link: React.FC<LinkProps> = ({
  link,
  size = 24,
  color = 'blue',
  style,
}): ReactElement => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={() => Linking.openURL(link)}>
        <Ionicons name='link-outline' size={size} color={color} />
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
});

export default Link;
