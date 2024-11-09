import { ReactElement, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, Text, LayoutAnimation } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  ButtonMode,
  ColorScheme,
  DateFormatMode,
  Icons,
  MajorStage,
  StackParamList,
} from '../../models';
import {
  formatAmount,
  formatDate,
  formatDateAndTime,
  formatDurationToDays,
} from '../../utils';
import { GlobalStyles } from '../../constants/styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import IconButton from '../UI/IconButton';
import MinorStageContextProvider from '../../store/minorStage-context';
import DetailArea from '../UI/list/DetailArea';
import ElementTitle from '../UI/list/ElementTitle';
import ElementComment from '../UI/list/ElementComment';
import AdditionalInfoBox from '../UI/infobox/AdditionalInfoBox';
import MinorStageList from '../MinorStage/MinorStageList';
import Button from '../UI/Button';

interface MajorStageListElementProps {
  majorStage: MajorStage;
  index: number;
}

const MajorStageListElement: React.FC<MajorStageListElementProps> = ({
  majorStage,
  index,
}): ReactElement => {
  const [showMinorStages, setShowMinorStages] = useState(false);

  // useReducser to get rid of alle that code
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
    { title: 'Country', value: majorStage.country },
  ];

  if (majorStage.minorStagesIds) {
    elementDetailInfo.push({
      title: 'Minor Stages',
      value: majorStage.minorStagesIds.length.toString(),
    });
  }

  let mainTransportationInfo: { title: string; value: string } = {
    title: '',
    value: '',
  };
  let additionalInfo: { title: string; value: string }[] = [];

  if (majorStage.transportation) {
    const transportStartDate = formatDateAndTime(
      majorStage.transportation.start_time,
      DateFormatMode.shortened
    );
    const transportEndDate = formatDateAndTime(
      majorStage.transportation!.arrival_time,
      DateFormatMode.shortened
    );
    const transportCosts = formatAmount(
      majorStage.transportation.transportation_costs
    );

    mainTransportationInfo = {
      title: 'Time until departure: ',
      value: '2 days',
    };

    additionalInfo = [
      {
        title: 'Departure: ',
        value: `${transportStartDate} at ${majorStage.transportation?.place_of_departure}`, // TODO: lat + lng for place and quick-link to google maps
      },
      {
        title: 'Arrival: ',
        value: `${transportEndDate} at ${majorStage.transportation?.place_of_arrival}`,
      },
      {
        title: 'Details: ',
        value: `${majorStage.transportation?.type} (${transportCosts})`,
      },
    ];
  }

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({}) => (
        <IconButton icon={Icons.add} size={30} onPress={() => {}} />
      ),
    });
  }, [navigation]);

  const handleshowMinorStages = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      update: { type: 'spring', springDamping: 0.6 },
    });
    setShowMinorStages((prevState) => !prevState);
  };

  // Buttons to delete and edit MajorStage

  return (
    <MinorStageContextProvider>
      <View style={styles.container}>
        <ElementTitle>{title}</ElementTitle>
        <ElementComment content={`${startDate} - ${endDate}`} />
        <DetailArea elementDetailInfo={elementDetailInfo} />
        {majorStage.transportation && (
          <AdditionalInfoBox
            title='Transportation'
            info={mainTransportationInfo}
            additionalInfo={additionalInfo}
            link={majorStage.transportation?.link}
          />
        )}
        <Button
          onPress={handleshowMinorStages}
          mode={ButtonMode.flat}
          colorScheme={
            !showMinorStages ? ColorScheme.accent : ColorScheme.complementary
          }
        >
          {!showMinorStages ? 'Show Minor Stages' : 'Hide Minor Stages'}
        </Button>
        {showMinorStages && <MinorStageList majorStageId={majorStage.id} />}
      </View>
    </MinorStageContextProvider>
  );
};

//TODO: Add a flat button to show minor stages

const styles = StyleSheet.create({
  container: {
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
