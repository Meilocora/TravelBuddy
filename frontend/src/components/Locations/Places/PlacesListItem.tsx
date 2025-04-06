import { ReactElement, useContext, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { Icons, PlaceToVisit, StackParamList } from '../../../models';
import IconButton from '../../UI/IconButton';
import { GlobalStyles } from '../../../constants/styles';
import Link from '../../UI/Link';
import { PlaceContext } from '../../../store/place-context';
import {
  toggleFavoritePlace,
  toggleVisitedPlace,
} from '../../../utils/http/place_to_visit';

interface PlacesListItemProps {
  place: PlaceToVisit;
  onToggleFavorite: (placeId: number) => void;
  onToggleVisited: (placeId: number) => void;
}

const PlacesListItem: React.FC<PlacesListItemProps> = ({
  place,
  onToggleFavorite,
  onToggleVisited,
}): ReactElement => {
  const [isOpened, setIsOpened] = useState(false);
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const placeCtx = useContext(PlaceContext);

  async function handleToggleFavorite() {
    const response = await toggleFavoritePlace(place.id);
    if (!response.error) {
      placeCtx.toggleFavorite(place.id);
      onToggleFavorite(place.id);
    }
  }

  async function handleToggleVisited() {
    const response = await toggleVisitedPlace(place.id);
    if (!response.error) {
      placeCtx.toggleVisited(place.id);
      onToggleVisited(place.id);
    }
  }

  function handleEdit() {
    navigation.navigate('ManagePlaceToVisit', {
      placeId: place.id,
      countryId: place.countryId,
    });
  }

  // TODO: Handle remove place, when displayed in MinorStages Screen

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setIsOpened(!isOpened)}>
        <View style={styles.row}>
          <Text style={styles.name}>{place.name}</Text>
          <View style={styles.buttonsContainer}>
            <IconButton
              icon={place.favorite ? Icons.heartFilled : Icons.heartOutline}
              onPress={handleToggleFavorite}
              color={GlobalStyles.colors.favorite}
              containerStyle={styles.button}
            />
            <IconButton
              icon={
                place.visited ? Icons.checkmarkFilled : Icons.checkmarkOutline
              }
              onPress={handleToggleVisited}
              color={GlobalStyles.colors.visited}
              containerStyle={styles.button}
            />
            <IconButton
              icon={Icons.editFilled}
              onPress={handleEdit}
              color={GlobalStyles.colors.edit}
              containerStyle={styles.button}
            />
          </View>
        </View>
        {isOpened && (
          <View style={styles.additionalContainer}>
            <Text style={styles.description}>{place.description}</Text>
            {place.link && (
              <View style={styles.row}>
                <Text style={styles.description}>Link to the place:</Text>
                <Link link={place.link} color={GlobalStyles.colors.visited} />
              </View>
            )}
            {place.maps_link && (
              <View style={styles.row}>
                <Text style={styles.description}>Link to Google Maps:</Text>
                <Link
                  link={place.maps_link}
                  color={GlobalStyles.colors.visited}
                  icon={Icons.location}
                />
              </View>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginVertical: 5,
    backgroundColor: GlobalStyles.colors.gray500,
    borderRadius: 16,
  },
  name: {
    color: GlobalStyles.colors.gray50,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: 4,
  },
  button: {
    marginHorizontal: 0,
    paddingHorizontal: 4,
  },
  additionalContainer: {
    marginHorizontal: 8,
    paddingBottom: 8,
  },
  description: {
    color: GlobalStyles.colors.gray200,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default PlacesListItem;
