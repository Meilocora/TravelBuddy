import { ReactElement } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { GlobalStyles } from '../../../constants/styles';

interface ListItemProps {
  children: string;
  onPress: (choosenItem: string) => void;
}

const ListItem: React.FC<ListItemProps> = ({
  children,
  onPress,
}): ReactElement => {
  return (
    <Pressable
      onPress={onPress.bind(null, children)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      android_ripple={{ color: GlobalStyles.colors.gray100 }}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.gray100,
    marginVertical: 5,
  },
  pressed: {
    opacity: 0.5,
  },
  text: {
    fontSize: 20,
    color: GlobalStyles.colors.gray100,
    flexWrap: 'wrap',
  },
});

export default ListItem;
