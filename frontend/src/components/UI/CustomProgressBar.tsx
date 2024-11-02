import { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';

import { GlobalStyles } from '../../constants/styles';

interface ProgressBarProps {
  progress: number;
}

//TODO: Improve the progress bar

const CustomProgressBar: React.FC<ProgressBarProps> = ({
  progress,
}): ReactElement => {
  return (
    <View style={styles.progressBarContainer}>
      <ProgressBar
        progress={progress}
        color={GlobalStyles.colors.error500}
        style={styles.progressBar}
        fillStyle={{ backgroundColor: GlobalStyles.colors.error500 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  progressBar: {
    marginVertical: 10,
    marginHorizontal: 'auto',
    width: '80%',
  },
});

export default CustomProgressBar;
