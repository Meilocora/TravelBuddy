import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native';

import Link from '../Link';
import { generateRandomString } from '../../../utils/generator';

interface AdditionalInfoPointsProps {
  additionalInfo: { title: string; value: string }[];
  openInfoBox: boolean;
  link?: string;
}

const AdditionalInfoPoints: React.FC<AdditionalInfoPointsProps> = ({
  additionalInfo,
  openInfoBox,
  link,
}) => {
  // Button to edit Transport

  return (
    <View style={[styles.infoBox, openInfoBox && styles.openedBox]}>
      {openInfoBox &&
        additionalInfo.map((info, index) => (
          <View key={generateRandomString()} style={styles.infoPointContainer}>
            <Text
              style={[styles.additionalInfo, styles.title]}
              numberOfLines={1}
            >
              {info.title}
            </Text>
            <Text
              style={[styles.additionalInfo, styles.value]}
              numberOfLines={1}
            >
              {info.value}
            </Text>
          </View>
        ))}
      {openInfoBox && link && <Link link={link} style={styles.link} />}
    </View>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    width: '90%',
    marginVertical: 3,
  },
  openedBox: {
    marginTop: 10,
    marginBottom: 6,
  },
  infoPointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalInfo: {
    fontStyle: 'italic',
  },
  title: {
    fontWeight: 'bold',
    flexBasis: '25%',
  },
  value: {
    flexBasis: '75%',
  },
  link: {
    marginTop: 3,
  },
});
export default AdditionalInfoPoints;
