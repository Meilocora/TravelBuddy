import { ReactElement } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ProgressBar } from 'react-native-paper';

import { GlobalStyles } from '../../constants/styles';

interface CustomProgressBarProps {
  progress: number;
}

const CustomProgressBar: React.FC<CustomProgressBarProps> = ({
  progress,
}): ReactElement => {
  const prettyProgress = (progress * 100).toFixed(2) + '%';

  return (
    <View style={styles.progressBarContainer}>
      <ProgressBar
        progress={progress}
        color={GlobalStyles.colors.primary800}
        style={styles.progressBar}
        fillStyle={{ backgroundColor: GlobalStyles.colors.primary100 }}
      />
      <Text style={styles.text}>{prettyProgress}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    marginHorizontal: 'auto',
    width: '80%',
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary700,
    borderRadius: 25,
  },
  text: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 12,
  },
});

export default CustomProgressBar;
