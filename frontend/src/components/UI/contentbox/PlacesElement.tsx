import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';

import { useContext, useState } from 'react';
import { ButtonMode, ColorScheme, MinorStage } from '../../../models';
import { MajorStageContext } from '../../../store/majorStage-context.';
import Button from '../Button';
import PlacesSelection from '../../MinorStage/ManageMinorStage/PlacesSelection';
import { fetchavailablePlacesByCountry } from '../../../utils/http';
import PlacesListItem from '../../Locations/Places/PlacesListItem';
import { generateRandomString } from '../../../utils';
import { MinorStageContext } from '../../../store/minorStage-context';

interface PlacesElementProps {
  majorStageId: number;
  minorStage: MinorStage;
  handleAdd: (name: string) => void;
  handleDelete: (name: string) => void;
}

const PlacesElement: React.FC<PlacesElementProps> = ({
  majorStageId,
  minorStage,
  handleAdd,
  handleDelete,
}) => {
  const [openSelection, setOpenSelection] = useState(false);
  const majorStageCtx = useContext(MajorStageContext);
  const majorStage = majorStageCtx.majorStages.find((stage) =>
    stage.minorStagesIds?.includes(minorStage.id)
  );
  const countryName = majorStage!.country;

  const minorStageCtx = useContext(MinorStageContext);

  let defaultPlacesNames: string[] = [];
  if (minorStage.placesToVisit) {
    defaultPlacesNames = minorStage.placesToVisit.map((place) => place.name);
  }

  function handleToggleSelection() {
    setOpenSelection((prev) => !prev);
  }

  function handleToggleFavourite(placeId: number) {
    minorStageCtx.toggleFavoritePlace(minorStage.id, placeId);
  }

  function handleToggleVisited(placeId: number) {
    minorStageCtx.toggleVisitedPlace!(minorStage.id, placeId);
  }

  const screenHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      {minorStage.placesToVisit!.length === 0 ? (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>No places selected.</Text>
        </View>
      ) : (
        <ScrollView style={{ maxHeight: screenHeight / 3 }}>
          {minorStage.placesToVisit!.map((place) => (
            <PlacesListItem
              place={place}
              key={generateRandomString()}
              onToggleFavorite={handleToggleFavourite}
              onToggleVisited={handleToggleVisited}
              onRemovePlace={handleDelete}
              majorStageId={majorStageId}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleToggleSelection}
          colorScheme={ColorScheme.complementary}
          mode={ButtonMode.flat}
        >
          Add Place
        </Button>
      </View>
      {openSelection && (
        <PlacesSelection
          chosenPlaces={defaultPlacesNames}
          countryName={countryName}
          onAddHandler={handleAdd}
          onCloseModal={handleToggleSelection}
          onFetchRequest={() =>
            fetchavailablePlacesByCountry(minorStage.id, countryName)
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlacesElement;
