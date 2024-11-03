import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native';

interface AdditionalInfoPointsProps {
  additionalInfo: { title: string; value: string }[];
  openInfoBox: boolean;
}

const AdditionalInfoPoints: React.FC<AdditionalInfoPointsProps> = ({
  additionalInfo,
  openInfoBox,
}) => {
  return (
    <View style={[styles.infoBox, openInfoBox && styles.openedBox]}>
      {openInfoBox &&
        additionalInfo.map((info, index) => (
          <View key={index} style={styles.infoPointContainer}>
            <Text style={[styles.additionalInfo, styles.title]}>
              {info.title}
            </Text>
            <Text style={[styles.additionalInfo, styles.value]}>
              {info.value}
            </Text>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    width: '90%',
    marginVertical: 3,
  },
  openedBox: {
    marginVertical: 10,
  },
  infoPointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalInfo: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'right',
    flexBasis: '25%',
    marginRight: 5,
  },
  value: {
    textAlign: 'left',
    flexBasis: '75%',
  },
});
export default AdditionalInfoPoints;
