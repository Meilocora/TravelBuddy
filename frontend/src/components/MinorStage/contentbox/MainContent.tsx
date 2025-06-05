import { ReactElement, useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { MajorStageStackParamList, MinorStage } from '../../../models';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TransportationElement from './TransportationElement';
import PlacesElement from './PlacesElement';
import {
  addMinorStageToFavoritePlace,
  deleteActivity,
  removeMinorStageFromFavoritePlace,
} from '../../../utils/http';
import ActivityElement from './ActivityElement';
import SpendingElement from './SpendingElement';
import { validateIsOver } from '../../../utils';
import { StagesContext } from '../../../store/stages-context';

interface MainContentProps {
  journeyId: number;
  majorStageId: number;
  minorStage: MinorStage;
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
  majorStageId,
  minorStage,
}): ReactElement => {
  const stagesCtx = useContext(StagesContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<MajorStageStackParamList>>();

  const isOver = validateIsOver(minorStage.scheduled_end_time);

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
    stagesCtx.fetchUserData();
  }

  async function handleRemovePlace(name: string) {
    await removeMinorStageFromFavoritePlace(name);
    stagesCtx.fetchUserData();
  }

  function handleAddActivity() {
    navigation.navigate('ManageActivity', {
      minorStageId: minorStage.id,
    });
  }

  function handleEditActivity(id: number) {
    navigation.navigate('ManageActivity', {
      minorStageId: minorStage.id,
      activityId: id,
    });
  }

  async function handleDeleteActivity(id: number) {
    await deleteActivity(id);
    stagesCtx.fetchUserData();
  }

  function handleAddSpending() {
    navigation.navigate('ManageSpending', {
      minorStageId: minorStage.id,
    });
  }

  function handleEditSpending(id: number) {
    navigation.navigate('ManageSpending', {
      minorStageId: minorStage.id,
      spendingId: id,
    });
  }

  let content: Content[] = [
    {
      title: 'transport',
      element: (
        <TransportationElement
          transportation={minorStage.transportation}
          handleAdd={handleAddTransportation}
          handleEdit={handleEditTransportation}
          minorStageIsOver={isOver}
        />
      ),
    },
    {
      title: 'places',
      element: (
        <PlacesElement
          majorStageId={majorStageId}
          minorStage={minorStage}
          handleAdd={handleAddPlace}
          handleDelete={handleRemovePlace}
        />
      ),
    },
    {
      title: 'activities',
      element: (
        <ActivityElement
          minorStage={minorStage}
          handleAdd={handleAddActivity}
          handleEdit={handleEditActivity}
          handleDelete={handleDeleteActivity}
        />
      ),
    },
    {
      title: 'spendings',
      element: (
        <SpendingElement
          minorStage={minorStage}
          handleAdd={handleAddSpending}
          handleEdit={handleEditSpending}
        />
      ),
    },
  ];

  let displayedContent: Content | undefined;
  if (minorStage.id === stagesCtx.activeHeader.minorStageId) {
    displayedContent = content.find(
      (content) => content.title === stagesCtx.activeHeader.header
    );
  }

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
