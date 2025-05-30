import React, { ReactElement, useEffect, useState } from 'react';
import {
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { generateRandomString } from '../../../utils';
import InfoText from '../../UI/InfoText';
import { GlobalStyles } from '../../../constants/styles';
import ListItem from '../../UI/search/ListItem';
import Button from '../../UI/Button';
import { ButtonMode, ColorScheme, StackParamList } from '../../../models';
import { FetchPlacesProps } from '../../../utils/http';

interface PlacesSelectionProps {
  onFetchRequest: (countryName: string) => Promise<FetchPlacesProps>;
  onAddHandler: (addedItem: string) => void;
  onCloseModal: () => void;
  chosenPlaces: string[];
  countryName: string;
}

const PlacesSelection = ({
  onFetchRequest,
  onAddHandler,
  onCloseModal,
  chosenPlaces,
  countryName,
}: PlacesSelectionProps): ReactElement => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const [fetchedData, setFetchedData] = useState<string[]>([]);

  const [customCountryId, setCustomCountryId] = useState<number | null>(null);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      const { places, countryId } = await onFetchRequest(countryName);

      setCustomCountryId(countryId!);

      if (places) {
        const names = places.map((item) => item.name);
        const namesNotChosen = names.filter(
          (name) => !chosenPlaces.includes(name)
        );
        LayoutAnimation.linear();
        setFetchedData(namesNotChosen);
      }
    }

    fetchData();
  }, [chosenPlaces]);

  // Timer to close Selection after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onCloseModal();
    }, 3000);

    return () => clearTimeout(timer); // Clear the timer if component unmounts or fetchedData changes
  }, [fetchedData, onCloseModal]);

  function handlePressListElement(item: string) {
    onAddHandler(item);
  }

  function handlePressAdd() {
    navigation.navigate('ManagePlaceToVisit', {
      placeId: null,
      countryId: customCountryId,
    });
  }

  let content: ReactElement | null = null;

  if (fetchedData.length > 0) {
    content = (
      <ScrollView style={styles.list}>
        {fetchedData.map((item) => (
          <ListItem
            key={generateRandomString()}
            onPress={handlePressListElement.bind(item)}
          >
            {item}
          </ListItem>
        ))}
        <Button
          colorScheme={ColorScheme.neutral}
          mode={ButtonMode.flat}
          onPress={onCloseModal}
          style={styles.button}
        >
          Dismiss
        </Button>
      </ScrollView>
    );
  } else {
    content = (
      <>
        <InfoText content='No items found' style={styles.info} />
        <Button
          colorScheme={ColorScheme.accent}
          onPress={handlePressAdd}
          style={styles.button}
        >
          Add Place!
        </Button>
      </>
    );
  }

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
      <View style={styles.outerContainer}>
        <Pressable onPress={onCloseModal}>{content}</Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -200 }],
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: '90%',
    marginHorizontal: 'auto',
    backgroundColor: GlobalStyles.colors.gray700,
    borderWidth: 2,
    borderColor: GlobalStyles.colors.gray300,
    borderRadius: 10,
    zIndex: 1,
  },
  list: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
    height: 'auto',
    maxHeight: 300,
    maxWidth: 290,
  },
  info: {
    marginVertical: 4,
    marginTop: 4,
  },
  button: {
    marginVertical: 8,
    marginHorizontal: 'auto',
    maxWidth: '40%',
  },
});

export default PlacesSelection;
