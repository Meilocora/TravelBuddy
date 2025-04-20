import { View, Text, StyleSheet } from 'react-native';

import {
  ButtonMode,
  ColorScheme,
  MapLocation,
  StackParamList,
  Transportation,
} from '../../../models';
import Button from '../Button';
import { formatAmount, formatDateTimeString } from '../../../utils';
import Link from '../Link';
import TextLink from '../TextLink';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GlobalStyles } from '../../../constants/styles';

interface TransportElementInfopointProps {
  subtitle: string;
  data: string;
  location?: MapLocation;
}

const TransportElementInfopoint: React.FC<TransportElementInfopointProps> = ({
  subtitle,
  data,
  location,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  function handleShowLocation() {
    navigation.navigate('ShowMap', {
      title: location?.title,
      lat: location?.lat!,
      lng: location?.lng!,
      colorScheme: 'complementary',
    });
  }

  return (
    <View style={infoPointStyles.innerContainer}>
      <View style={infoPointStyles.subtitleContainer}>
        {location ? (
          <TextLink
            onPress={handleShowLocation}
            textStyle={infoPointStyles.locationLink}
          >
            {subtitle}:{' '}
          </TextLink>
        ) : (
          <Text style={infoPointStyles.subtitle}>{subtitle}: </Text>
        )}
      </View>
      <View style={infoPointStyles.data}>
        <Text>{data}</Text>
      </View>
    </View>
  );
};

const infoPointStyles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '30%',
  },
  subtitle: {
    fontWeight: 'bold',
  },
  data: {
    width: '70%',
    overflow: 'hidden',
  },
  locationLink: {
    color: GlobalStyles.colors.complementary600,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

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
      location: {
        title: transportation.place_of_departure,
        lat: transportation.departure_latitude,
        lng: transportation.departure_longitude,
      },
    },
    {
      subtitle: 'Arrival',
      data: `${formatDateTimeString(transportation.arrival_time)} at ${
        transportation.place_of_arrival
      }`,
      location: {
        title: transportation.place_of_arrival,
        lat: transportation.arrival_latitude,
        lng: transportation.arrival_longitude,
      },
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
          location={infoPoint.location}
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
