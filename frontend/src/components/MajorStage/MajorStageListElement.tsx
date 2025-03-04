import { ReactElement, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutAnimation,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  ButtonMode,
  ColorScheme,
  Icons,
  JourneyBottomTabsParamsList,
  MajorStage,
  MajorStageStackParamList,
  StackParamList,
} from '../../models';
import {
  formatAmount,
  formatCountdown,
  formatDateString,
  formatDateAndTime,
  formatDurationToDays,
} from '../../utils';
import { GlobalStyles } from '../../constants/styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import IconButton from '../UI/IconButton';
import DetailArea from '../UI/list/DetailArea';
import ElementTitle from '../UI/list/ElementTitle';
import ElementComment from '../UI/list/ElementComment';
import AdditionalInfoBox from '../UI/infobox/AdditionalInfoBox';
import MinorStageList from '../MinorStage/MinorStageList';
import Button from '../UI/Button';
import { LinearGradient } from 'expo-linear-gradient';

interface MajorStageListElementProps {
  journeyId: number;
  majorStage: MajorStage;
  index: number;
}

const MajorStageListElement: React.FC<MajorStageListElementProps> = ({
  journeyId,
  majorStage,
  index,
}): ReactElement => {
  const [showMinorStages, setShowMinorStages] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<JourneyBottomTabsParamsList>>();
  // const transportNavigation =
  //   useNavigation<NativeStackNavigationProp<MajorStageStackParamList>>();

  const hasMinorStages =
    majorStage.minorStagesIds && majorStage.minorStagesIds.length > 0;
  // useReducer to get rid of alle that code
  const moneyAvailable = formatAmount(majorStage.costs.budget);
  const moneyPlanned = formatAmount(majorStage.costs.spent_money);
  const startDate = formatDateString(majorStage.scheduled_start_time);
  const endDate = formatDateString(majorStage.scheduled_end_time);
  const durationInDays = formatDurationToDays(
    majorStage.scheduled_start_time,
    majorStage.scheduled_end_time
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
      majorStage.transportation.start_time
    );
    const transportEndDate = formatDateAndTime(
      majorStage.transportation!.arrival_time
    );
    const transportCosts = formatAmount(
      majorStage.transportation.transportation_costs
    );

    mainTransportationInfo = {
      title: 'Time until departure: ',
      value: formatCountdown(majorStage.transportation.start_time),
    };

    additionalInfo = [
      {
        title: 'Departure: ',
        value: `${transportStartDate} at ${majorStage.transportation?.place_of_departure}`, // TODO: lat + lng for place and quick-link to google maps?
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

  function handleOnPress() {
    // TODO: This nessesary?
  }

  function handleEdit() {
    navigation.navigate('MajorStageStackNavigator', {
      screen: 'ManageMajorStage',
      params: {
        journeyId: journeyId,
        majorStageId: majorStage.id,
      },
    });
  }

  function handleAddTransportation() {
    navigation.navigate('MajorStageStackNavigator', {
      screen: 'ManageTransportation',
      params: {
        journeyId: journeyId,
        majorStageId: majorStage.id,
      },
    });

    // TODO: Create ManageTransportation Form
    // TODO: Implement backend for adding, updating and deleting transportation
    // TODO: Frontendimplementation via existing majorStageCtx
  }

  function handleAddMinorStage() {
    navigation.navigate('MajorStageStackNavigator', {
      screen: 'ManageMinorStage',
      params: {
        majorStageId: majorStage.id,
      },
    });
  }

  const handleShowMinorStages = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      update: { type: 'spring', springDamping: 0.6 },
    });
    setShowMinorStages((prevState) => !prevState);
  };

  // TODO: Edit Transportation
  // TODO: add MinorStage
  // TODO: Edit MinorStage

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={['#f1dfcf', '#b8a671']}
        style={{ height: '100%' }}
      >
        <Pressable
          style={({ pressed }) => pressed && styles.pressed}
          android_ripple={{ color: GlobalStyles.colors.accent100 }}
          onPress={handleOnPress}
        >
          <View style={styles.innerContainer}>
            <View style={styles.headerContainer}>
              <ElementTitle>{title}</ElementTitle>
              <IconButton
                icon={Icons.edit}
                color={GlobalStyles.colors.accent800}
                onPress={handleEdit}
              />
            </View>
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
            {!majorStage.transportation && (
              <Button
                onPress={handleAddTransportation}
                mode={ButtonMode.flat}
                colorScheme={ColorScheme.accent}
              >
                Add Transportation
              </Button>
            )}
            {hasMinorStages && (
              <Button
                onPress={handleShowMinorStages}
                mode={ButtonMode.flat}
                colorScheme={
                  !showMinorStages
                    ? ColorScheme.accent
                    : ColorScheme.complementary
                }
              >
                {!showMinorStages ? 'Show Minor Stages' : 'Hide Minor Stages'}
              </Button>
            )}
            {showMinorStages && <MinorStageList majorStageId={majorStage.id} />}
          </View>
        </Pressable>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    borderColor: GlobalStyles.colors.accent800,
    borderWidth: 2,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    elevation: 5,
    shadowColor: GlobalStyles.colors.gray500,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.5,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  headerContainer: {
    flex: 1,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

export default MajorStageListElement;
