import { ReactElement, useContext, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Icons, Journey, StageFilter } from '../../models';
import JourneyListElement from './JourneysListElement';
import { parseDate } from '../../utils';
import IconButton from '../UI/IconButton';
import FilterSettings from '../UI/FilterSettings';
import { deleteJourney } from '../../utils/http';
import { JourneyContext } from '../../store/journey-context';
import Modal from '../UI/Modal';

interface JourneysListProps {
  journeys: Journey[];
}

const JourneysList: React.FC<JourneysListProps> = ({
  journeys,
}): ReactElement => {
  const [filter, setFilter] = useState<StageFilter>(StageFilter.current);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [deleteJourneyId, setDeleteJourneyId] = useState<number | null>(null);

  const journeyCtx = useContext(JourneyContext);
  const now = new Date();
  const shownJourneys = journeys.filter((journey) => {
    if (filter === StageFilter.current) {
      return parseDate(journey.scheduled_end_time) >= now; // Only include journeys that haven't ended
    }
    return true; // Include all journeys for other filters
  });

  function handleSetFilter(filter: StageFilter) {
    setFilter(filter);
    setOpenModal(false);
  }

  function handlePressDelete(journeyId: number) {
    setOpenDeleteModal(true);
    setDeleteJourneyId(journeyId);
  }

  function closeDeleteModal() {
    setOpenDeleteModal(false);
    setDeleteJourneyId(null);
  }

  async function handleDelete() {
    const { error, status } = await deleteJourney(deleteJourneyId!);
    if (!error && status === 200) {
      journeyCtx.deleteJourney(deleteJourneyId!);
    }
  }

  return (
    <View style={styles.container}>
      {openDeleteModal && (
        <Modal
          title='Are you sure?'
          content={`The Journey and all it's Major and Minor Stages will be deleted permanently!`}
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
        />
      )}
      <View style={styles.buttonContainer}>
        <IconButton
          icon={Icons.settings}
          onPress={() => setOpenModal((prevValue) => !prevValue)}
        />
      </View>
      {openModal && (
        <FilterSettings filter={filter} setFilter={handleSetFilter} />
      )}
      <FlatList
        style={{ marginBottom: 50 }}
        data={shownJourneys}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 200).duration(1000)}
          >
            <JourneyListElement journey={item} onDelete={handlePressDelete} />
          </Animated.View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default JourneysList;
