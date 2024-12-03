import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { GlobalStyles } from '../../constants/styles';
import { ReactElement } from 'react';
import { ButtonMode, ColorScheme } from '../../models';
import Button from './Button';

interface ErrorOverlayProps {
  title?: string;
  message: string;
  onPress: () => void;
  buttonText?: string;
}

// TODO: Improve, so it slides in from bottom
export const ErrorOverlay: React.FC<ErrorOverlayProps> = ({
  title = 'An Error occurred!',
  message,
  onPress,
  buttonText = 'Close',
}): ReactElement => {
  const [modalVisible, setModalVisible] = useState(true);

  function onClose() {
    onPress();
    setModalVisible(false);
  }

  return (
    <Modal visible={true} animationType='fade' transparent={true}>
      <View style={styles.container}>
        <Text style={[styles.text, styles.title]}>{title}</Text>
        <Text style={styles.text}>{message}</Text>
        <Button
          mode={ButtonMode.default}
          onPress={onClose}
          colorScheme={ColorScheme.error}
        >
          {buttonText}
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 'auto',
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: GlobalStyles.colors.error50,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: GlobalStyles.colors.error500,
  },
  text: {
    textAlign: 'center',
    marginBottom: 8,
    color: GlobalStyles.colors.error500,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ErrorOverlay;
