import { View, Text, StyleSheet } from 'react-native';

import { ButtonMode, ColorScheme, Transportation } from '../../../models';
import Button from '../Button';
import { formatAmount, formatDateTimeString } from '../../../utils';
import Link from '../Link';

interface TransportElementInfopointProps {
  subtitle: string;
  data: string;
}

const TransportElementInfopoint: React.FC<TransportElementInfopointProps> = ({
  subtitle,
  data,
}) => {
  return (
    <View style={styles.innerContainer}>
      <Text style={styles.subtitle}>{subtitle}: </Text>
      <View style={styles.data}>
        <Text numberOfLines={1}>{data}</Text>
      </View>
    </View>
  );
};

interface TransportationElementProps {
  transportation: Transportation | undefined;
  handleAdd: () => void;
  handleEdit: (id: number) => void;
}

const TransportationElement: React.FC<TransportationElementProps> = ({
  transportation,
  handleAdd,
  handleEdit,
}) => {
  if (transportation === undefined) {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>No transportation found.</Text>
        <Button
          onPress={handleAdd}
          colorScheme={ColorScheme.complementary}
          mode={ButtonMode.flat}
        >
          Add Transportation
        </Button>
      </View>
    );
  }

  const infoPointsData = [
    {
      subtitle: 'Departure',
      data: `${formatDateTimeString(transportation.start_time)} at ${
        transportation.place_of_departure
      }`,
    },
    {
      subtitle: 'Arrival',
      data: `${formatDateTimeString(transportation.arrival_time)} at ${
        transportation.place_of_arrival
      }`,
    },
    {
      subtitle: 'Details',
      data: `${transportation.type} (${formatAmount(
        transportation.transportation_costs
      )})`,
    },
  ];

  return (
    <View style={styles.container}>
      {infoPointsData.map((infoPoint, index) => (
        <TransportElementInfopoint
          key={index}
          subtitle={infoPoint.subtitle}
          data={infoPoint.data}
        />
      ))}
      {transportation.link && (
        <Link link={transportation.link} style={styles.link} />
      )}
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => handleEdit(transportation.id)}
          colorScheme={ColorScheme.complementary}
        >
          Edit
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  infoText: {
    fontSize: 16,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },
  innerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subtitle: {
    width: '30%',
    fontWeight: 'bold',
  },
  data: {
    width: '70%',
    overflow: 'hidden',
  },
  link: {
    marginHorizontal: 'auto',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default TransportationElement;
