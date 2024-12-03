import { ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlobalStyles } from '../../../constants/styles';

interface InfoPointProps {
  title: string;
  value: string;
}

const InfoPoint: React.FC<InfoPointProps> = ({
  title,
  value,
}): ReactElement => {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: GlobalStyles.colors.gray700,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  value: {
    fontSize: 16,
    color: GlobalStyles.colors.gray50,
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    color: GlobalStyles.colors.gray300,
  },
});

export default InfoPoint;
