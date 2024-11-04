import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReactElement } from 'react';

import { Icons } from '../../models';

interface IconButtonProps {
  icon: Icons;
  size?: number;
  color?: string;
  onPress: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 24,
  color = 'white',
  onPress,
}): ReactElement => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.buttonContainer}>
        <Ionicons name={icon} size={size} color={color} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 24,
    padding: 6,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default IconButton;
