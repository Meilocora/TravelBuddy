import { ReactElement, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated';

interface PopupProps {
  content: string;
  onClose: () => void;
  duration?: number;
}

// TODO: Create different colorSchemes analog to the button component

const Popup: React.FC<PopupProps> = ({
  content,
  onClose,
  duration = 3000,
}): ReactElement => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      entering={SlideInLeft}
      exiting={SlideOutLeft}
      style={styles.container}
    >
      <Pressable onPress={onClose}>
        <Text style={styles.popupContent}>{content}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.colors.gray700,
    zIndex: 1,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderStartWidth: 10,
    borderColor: GlobalStyles.colors.primary200,
    borderTopWidth: 2,
    borderEndWidth: 2,
    borderBottomWidth: 2,
    opacity: 0.92,
  },
  popupContent: {
    color: GlobalStyles.colors.primary200,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

export default Popup;
