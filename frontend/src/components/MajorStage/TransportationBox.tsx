import { ReactElement, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  LayoutAnimation,
} from 'react-native';

import ElementTitle from '../UI/list/ElementTitle';
import { GlobalStyles } from '../../constants/styles';
import { Icons, Transportation, TransportationType } from '../../models';
import IconButton from '../UI/IconButton';
import { TransportElementInfopoint } from '../MinorStage/contentbox/TransportationElement';
import {
  formatAmount,
  formatCountdown,
  formatDateTimeString,
} from '../../utils';
import Link from '../UI/Link';

interface TransportationBoxProps {
  transportation: Transportation;
  majorStageIsOver: boolean;
  onPressEdit: () => void;
}

const TransportationBox: React.FC<TransportationBoxProps> = ({
  transportation,
  majorStageIsOver,
  onPressEdit,
}): ReactElement => {
  const [openInfoBox, setOpenInfoBox] = useState(false);

  let countdown: string | undefined = undefined;
  if (transportation) {
    countdown = formatCountdown(transportation.start_time);
  }

  const handleOpenInfoBox = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      update: { type: 'spring', springDamping: 0.6 },
    });
    setOpenInfoBox((prevState) => !prevState);
  };

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
    <View
      style={[
        styles.outerContainer,
        majorStageIsOver && styles.inactiveOuterContainer,
      ]}
    >
      <Pressable
        onPress={handleOpenInfoBox}
        android_ripple={{ color: GlobalStyles.colors.accent200 }}
        style={({ pressed }) => [
          styles.innerContainer,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.mainInfoContainer}>
          <View style={styles.textContainer}>
            <ElementTitle style={styles.title}>Transportation</ElementTitle>
            <Text style={styles.comment}>Starts in: {countdown}</Text>
          </View>
          {!majorStageIsOver && (
            <View style={styles.buttonContainer}>
              <IconButton
                icon={Icons.edit}
                color={GlobalStyles.colors.accent800}
                onPress={onPressEdit}
                style={styles.button}
              />
            </View>
          )}
        </View>
        {openInfoBox &&
          infoPointsData.map((infoPoint, index) => (
            <TransportElementInfopoint
              key={index}
              subtitle={infoPoint.subtitle}
              data={infoPoint.data}
              location={infoPoint.location}
              colorScheme='accent'
              transportationType={transportation.type as TransportationType}
            />
          ))}
        {transportation.link && (
          <Link link={transportation.link} style={styles.link} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  outerContainer: {
    width: '95%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.accent700,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
    backgroundColor: GlobalStyles.colors.accent100,
  },
  inactiveOuterContainer: {
    borderColor: GlobalStyles.colors.gray500,
    backgroundColor: GlobalStyles.colors.gray100,
  },
  innerContainer: {
    marginHorizontal: 10,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainInfoContainer: {
    flexDirection: 'row',
  },
  textContainer: {
    width: '80%',
  },
  text: {
    textAlign: 'center',
  },
  comment: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '20%',
  },
  pressed: {
    opacity: 0.5,
  },
  button: {
    width: 'auto',
  },
  link: {
    marginHorizontal: 'auto',
  },
});

export default TransportationBox;
