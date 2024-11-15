import { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

import { GlobalStyles } from '../../constants/styles';
import { ButtonMode, ColorScheme } from '../../models';
import Button from './Button';

interface ModalProps {
  title: string;
  content: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  content,
  onConfirm,
  onCancel,
}): ReactElement => {
  return (
    <BlurView intensity={85} tint='dark' style={styles.blurcontainer}>
      <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>
          {content}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
          style={styles.button}
            mode={ButtonMode.flat}
            onPress={onCancel!}
            colorScheme={ColorScheme.neutral}
          >
            Cancel
          </Button>
          {onConfirm && (
            <Button onPress={onConfirm} colorScheme={ColorScheme.error} style={styles.button}>
              Delete
            </Button>
          )}
        </View>
      </Animated.View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  blurcontainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    zIndex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    marginHorizontal: 'auto',
    marginVertical: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    padding: 24,
    backgroundColor: GlobalStyles.colors.gray700,
    // opacity: 0.85,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GlobalStyles.colors.gray50,
    marginVertical: 8,
  },
  content: {
    fontSize: 18,
    color: GlobalStyles.colors.gray50,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    marginHorizontal: 4
  }
});

export default Modal;
