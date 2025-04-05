import { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';

import { MajorStageStackParamList, MinorStage } from '../../../models';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TransportationElement from './TransportationElement';

interface MainContentProps {
  journeyId: number;
  minorStage: MinorStage;
  contentState: { activeHeader: string };
}

interface ContentElementProps {
  handleAdd: () => void;
  handleEdit: (id: number) => void;
  handleDelete?: (id: number) => void;
}

interface Content {
  title: string;
  element: ReactElement<ContentElementProps>;
}

const MainContent: React.FC<MainContentProps> = ({
  journeyId,
  minorStage,
  contentState,
}): ReactElement => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MajorStageStackParamList>>();

  let content: Content[] = [
    {
      title: 'transport',
      element: (
        <TransportationElement
          transportation={minorStage.transportation}
          handleAdd={handleAddTransportation}
          handleEdit={handleEditTransportation}
        />
      ),
    },
  ];

  function handleAddTransportation() {
    navigation.navigate('ManageTransportation', {
      journeyId: journeyId,
      minorStageId: minorStage.id,
    });
  }

  function handleEditTransportation(id: number) {
    navigation.navigate('ManageTransportation', {
      journeyId: journeyId,
      minorStageId: minorStage.id,
      transportationId: id,
    });
  }

  // TODO: Implement places handling
  // TODO: Implement activities handling
  // TODO: Implement spendings handling

  // if (minorStage.placesToVisit && minorStage.placesToVisit!.length > 0) {
  //   content.push({
  //     title: 'places',
  //     contents: minorStage.placesToVisit!.map((place) => {
  //       return {
  //         subtitle: `${place.name}: `,
  //         data: place.description,
  //         link: place.link,
  //       };
  //     }),
  //   });
  // } else {
  //   content.push({
  //     title: 'places',
  //     contents: [
  //       {
  //         subtitle: 'No places planned yet.',
  //         data: '',
  //       },
  //     ],
  //   });
  // }

  // if (minorStage.activities && minorStage.activities!.length > 0) {
  //   content.push({
  //     title: 'activities',
  //     contents: minorStage
  //       .activities!.map((activity) => [
  //         {
  //           subtitle: `${activity.name}: `,
  //           data: activity.description,
  //           link: activity.link,
  //         },
  //         {
  //           subtitle: 'Place: ',
  //           data: activity.place,
  //         },
  //         {
  //           subtitle: 'Booked? ',
  //           data: activity.booked ? 'Yes' : 'Not yet',
  //         },
  //         {
  //           subtitle: 'Costs: ',
  //           data: formatAmount(activity.costs),
  //         },
  //       ])
  //       .flat(),
  //   });
  // } else {
  //   content.push({
  //     title: 'activities',
  //     contents: [
  //       {
  //         subtitle: 'No activities planned yet.',
  //         data: '',
  //       },
  //     ],
  //   });
  // }

  // if (minorStage.costs.spendings && minorStage.costs.spendings!.length > 0) {
  //   content.push({
  //     title: 'spendings',
  //     contents: minorStage.costs.spendings!.map((spending) => {
  //       return {
  //         subtitle: `${spending.name}: `,
  //         data: formatAmount(spending.amount),
  //       };
  //     }),
  //   });
  // } else {
  //   content.push({
  //     title: 'spendings',
  //     contents: [
  //       {
  //         subtitle: 'No spendings found.',
  //         data: '',
  //       },
  //     ],
  //   });
  // }

  const displayedContent = content.find(
    (content) => content.title === contentState.activeHeader
  );

  return <View style={styles.container}>{displayedContent?.element}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: 10,
  },
});

export default MainContent;
