import { ReactElement, useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { MajorStageStackParamList, MinorStage } from '../../../models';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TransportationElement from './TransportationElement';
import PlacesElement from './PlacesElement';
import {
  addMinorStageToFavoritePlace,
  removeMinorStageFromFavoritePlace,
} from '../../../utils/http';
import { MinorStageContext } from '../../../store/minorStage-context';

interface MainContentProps {
  journeyId: number;
  minorStage: MinorStage;
  contentState: { activeHeader: string };
}

interface ContentElementProps {
  handleAdd?: (name?: string) => void;
  handleEdit?: (id: number) => void;
  handleDelete?: (id?: number, name?: string) => void;
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
  const minorStageCtx = useContext(MinorStageContext);
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
    {
      title: 'places',
      element: (
        <PlacesElement
          minorStage={minorStage}
          handleAdd={handleAddPlace}
          handleDelete={handleRemovePlace}
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

  async function handleAddPlace(name: string) {
    await addMinorStageToFavoritePlace(name, minorStage.id);
    await minorStageCtx.refetchMinorStages(minorStage.id);
  }

  async function handleRemovePlace(name: string) {
    await removeMinorStageFromFavoritePlace(name);
    await minorStageCtx.refetchMinorStages(minorStage.id);
  }

  function handleEditPlace(id: number) {
    // TODO: Navigate to ManagePlaceToVisit screen
  }

  // TODO: Implement places handling
  // TODO: Implement activities handling
  // TODO: Implement spendings handling

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
