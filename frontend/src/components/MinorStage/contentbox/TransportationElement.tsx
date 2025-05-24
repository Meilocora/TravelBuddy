import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  ButtonMode,
  ColorScheme,
  Icons,
  MapLocation,
  StackParamList,
  Transportation,
  TransportationType,
} from '../../../models';
import Button from '../../UI/Button';
import {
  formatAmount,
  formatDateTimeString,
  formatDuration,
  parseDateAndTime,
} from '../../../utils';
import Link from '../../UI/Link';
import TextLink from '../../UI/TextLink';
import { Location, LocationType } from '../../../utils/http';
import IconButton from '../../UI/IconButton';

interface TransportElementInfopointProps {
  subtitle: string;
  data: string;
  location?: MapLocation;
  colorScheme: 'accent' | 'complementary';
  transportationType: TransportationType;
}

export const TransportElementInfopoint: React.FC<
  TransportElementInfopointProps
> = ({ subtitle, data, location, colorScheme, transportationType }) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  function handleShowLocation() {
    const mapLocation: Location = {
      belonging: 'Undefined',
      locationType:
        `transportation_${subtitle.toLowerCase()}` as unknown as LocationType,
      data: {
        name: location?.title!,
        latitude: location?.lat!,
        longitude: location?.lng!,
      },
      transportationType: transportationType,
    };
    navigation.navigate('ShowMap', {
      location: mapLocation,
      colorScheme: colorScheme,
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
            {subtitle}:
          </TextLink>
        ) : (
          <Text style={infoPointStyles.subtitle}>{subtitle}:</Text>
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
    marginVertical: 3,
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
    color: 'blue',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

interface TransportationElementProps {
  transportation: Transportation | undefined;
  handleAdd: () => void;
  handleEdit: (id: number) => void;
  minorStageIsOver?: boolean;
}

const TransportationElement: React.FC<TransportationElementProps> = ({
  transportation,
  handleAdd,
  handleEdit,
  minorStageIsOver,
}) => {
  if (transportation === undefined) {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>No transportation found.</Text>
        {!minorStageIsOver && (
          <Button
            onPress={handleAdd}
            colorScheme={ColorScheme.complementary}
            mode={ButtonMode.flat}
          >
            Add Transportation
          </Button>
        )}
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

  // TODO: Improve styling and also add Duration for MajorStage
  // TODO: Also add countdown for minorStage
  const duration = formatDuration(
    transportation.start_time,
    transportation.arrival_time
  );

  return (
    <View style={styles.container}>
      {infoPointsData.map((infoPoint, index) => (
        <TransportElementInfopoint
          key={index}
          subtitle={infoPoint.subtitle}
          data={infoPoint.data}
          location={infoPoint.location}
          colorScheme='complementary'
          transportationType={transportation.type as TransportationType}
        />
      ))}
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          icon={Icons.duration}
          onPress={() => {}}
          size={22}
          style={styles.icon}
          color='black'
        />
        <Text>{duration}</Text>
        {transportation.link && (
          <Link link={transportation.link} style={styles.link} />
        )}
      </View>
      {!minorStageIsOver && (
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => handleEdit(transportation.id)}
            colorScheme={ColorScheme.complementary}
          >
            Edit
          </Button>
        </View>
      )}
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
    marginVertical: 0,
    paddingVertical: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    marginVertical: 0,
    paddingVertical: 0,
  },
});

export default TransportationElement;
