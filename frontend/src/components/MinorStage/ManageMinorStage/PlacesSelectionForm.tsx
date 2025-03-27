import { ReactElement, useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { GlobalStyles } from '../../../constants/styles';
import IconButton from '../../UI/IconButton';
import { Icons } from '../../../models';
import TagCloud from '../../UI/TagCloud';
import { generateRandomString } from '../../../utils';
import PlacesSelection from './PlacesSelection';
import { fetchavailablePlacesByCountry } from '../../../utils/http';

interface PlacesSelectionFormProps {
  onAddPlace: (placeName: string) => void;
  onDeletePlace: (placeName: string) => void;
  invalid: boolean;
  minorStageId: number;
  defaultPlaceNames?: string[];
  countryName: string;
}

const PlacesSelectionForm: React.FC<PlacesSelectionFormProps> = ({
  onAddPlace,
  onDeletePlace,
  invalid,
  minorStageId,
  defaultPlaceNames,
  countryName,
}): ReactElement => {
  const [isInvalid, setIsInvalid] = useState<boolean>(invalid);
  const [openSelection, setOpenSelection] = useState(false);
  const [placeNames, setPlaceNames] = useState<string[]>([]);

  // Synchronize state with prop changes
  useEffect(() => {
    setIsInvalid(invalid);
    setPlaceNames(defaultPlaceNames || []);
  }, [invalid]);

  function handleAddPlace(placeName: string) {
    onAddPlace(placeName);
    setPlaceNames([...placeNames, placeName]);
  }

  function handleDeletePlace(placeName: string) {
    onDeletePlace(placeName);
    setPlaceNames(placeNames.filter((name) => name !== placeName));
  }

  function handleCloseModal() {
    setOpenSelection(false);
    Keyboard.dismiss();
  }

  function handlePressAdd() {
    setIsInvalid(false);
    setOpenSelection((prevValue) => !prevValue);
  }

  console.log(countryName);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Places</Text>
      </View>
      {isInvalid && (
        <View>
          <Text style={styles.errorText}>Please select a place to visit</Text>
        </View>
      )}
      {/* TODO: List instead of TagCloud ... maybe PlaceList? */}
      {placeNames.length > 0 && (
        <View style={styles.cloudContainer}>
          {placeNames.map((name) => (
            <TagCloud
              text={name}
              onPress={() => handleDeletePlace(name)}
              key={generateRandomString()}
            />
          ))}
        </View>
      )}
      <IconButton icon={Icons.add} onPress={handlePressAdd} />
      {openSelection && (
        <PlacesSelection
          chosenPlaces={placeNames}
          countryName={countryName}
          onAddHandler={handleAddPlace}
          onCloseModal={handleCloseModal}
          onFetchRequest={() =>
            fetchavailablePlacesByCountry(minorStageId, countryName)
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outside: {
    flex: 1,
    height: '100%',
  },
  container: {
    flex: 1,
    marginVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    borderTopWidth: 3,
    borderTopColor: GlobalStyles.colors.gray200,
    width: '95%',
    paddingVertical: 8,
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    color: GlobalStyles.colors.gray50,
  },
  cloudContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  errorText: {
    fontSize: 16,
    color: GlobalStyles.colors.error200,
    fontStyle: 'italic',
  },
});

export default PlacesSelectionForm;
