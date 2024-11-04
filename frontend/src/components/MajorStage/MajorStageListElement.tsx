import { ReactElement, useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  DateFormatMode,
  Icons,
  MajorStage,
  StackParamList,
} from '../../models';
import ElementTitle from '../UI/list/ElementTitle';
import DetailArea from '../UI/list/DetailArea';
import {
  formatAmount,
  formatDate,
  formatDateAndTime,
  formatDurationToDays,
} from '../../utils';
import ElementComment from '../UI/list/ElementComment';
import AdditionalInfoBox from '../UI/infobox/AdditionalInfoBox';
import { GlobalStyles } from '../../constants/styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import IconButton from '../UI/IconButton';
import MinorStageContextProvider from '../../store/minorStage-context';

interface MajorStageListElementProps {
  majorStage: MajorStage;
  index: number;
}

const MajorStageListElement: React.FC<MajorStageListElementProps> = ({
  majorStage,
  index,
}): ReactElement => {
  const moneyAvailable = formatAmount(majorStage.costs.available_money);
  const moneyPlanned = formatAmount(majorStage.costs.planned_costs);
  const startDate = formatDate(majorStage.scheduled_start_time);
  const endDate = formatDate(majorStage.scheduled_end_time);
  const durationInDays = formatDurationToDays(
    majorStage.scheduled_end_time,
    majorStage.scheduled_start_time
  );

  const title = `#${index + 1} ${majorStage.title}`;

  const elementDetailInfo = [
    {
      title: 'Duration',
      value: `${durationInDays} days`,
    },
    { title: 'Costs', value: `${moneyPlanned} / ${moneyAvailable}` },
    {
      title: 'Minor Stages',
      value: majorStage.minorStagesIds.length.toString(),
    },
    { title: 'Country', value: majorStage.country },
  ];

  const transportStartDate = formatDateAndTime(
    majorStage.transportation.start_time,
    DateFormatMode.shortened
  );
  const transportEndDate = formatDateAndTime(
    majorStage.transportation.arrival_time,
    DateFormatMode.shortened
  );
  const transportCosts = formatAmount(
    majorStage.transportation.transportation_costs
  );

  const mainTransportationInfo = {
    title: 'Time until departure: ',
    value: '2 days',
  };

  const additionalInfo = [
    {
      title: 'Departure: ',
      value: `${transportStartDate} at ${majorStage.transportation.place_of_departure}`, // TODO: lat + lng for place and quick-link to google maps
    },
    {
      title: 'Arrival: ',
      value: `${transportEndDate} at ${majorStage.transportation.place_of_arrival}`,
    },
    {
      title: 'Details: ',
      value: `${majorStage.transportation.type} (${transportCosts})`,
    },
  ];

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({}) => (
        <IconButton icon={Icons.add} size={30} onPress={() => {}} />
      ),
    });
  }, [navigation]);

  // Buttons to delete and edit MajorStage

  return (
    <MinorStageContextProvider>
      <View style={styles.majorStage}>
        <ElementTitle>{title}</ElementTitle>
        <ElementComment content={`${startDate} - ${endDate}`} />
        <DetailArea elementDetailInfo={elementDetailInfo} />
        <AdditionalInfoBox
          title='Transportation'
          info={mainTransportationInfo}
          additionalInfo={additionalInfo}
          link={majorStage.transportation.link}
        />
        <Text>Show Minor Stages</Text>
      </View>
    </MinorStageContextProvider>
  );
};

//TODO: Add a flat button to show minor stages

const styles = StyleSheet.create({
  majorStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: GlobalStyles.colors.accent50,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: GlobalStyles.colors.accent800,
    elevation: 5,
    shadowColor: GlobalStyles.colors.gray500,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
});

export default MajorStageListElement;
