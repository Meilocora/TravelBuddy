import React, { ReactElement, useEffect, useState } from 'react';
import {
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { generateRandomString } from '../../../utils';
import InfoText from '../../UI/InfoText';
import { GlobalStyles } from '../../../constants/styles';
import ListItem from '../../UI/search/ListItem';
import { FetchCustomCountryResponseProps } from '../../../utils/http/custom_country';
import Button from '../../UI/Button';
import { BottomTabsParamList, ButtonMode, ColorScheme } from '../../../models';

interface SelectionProps {
  onFetchRequest: () => Promise<FetchCustomCountryResponseProps>;
  onAddHandler: (addedItem: string) => void;
  onCloseModal: () => void;
  chosenCountries: string[];
}

const Selection = ({
  onFetchRequest,
  onAddHandler,
  onCloseModal,
  chosenCountries,
}: SelectionProps): ReactElement => {
  const navigation = useNavigation<NavigationProp<BottomTabsParamList>>();
  const [fetchedData, setFetchedData] = useState<string[]>([]);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      const { data } = await onFetchRequest();
      if (data) {
        const names = data.map((item) => item.name);
        const namesNotChosen = names.filter(
          (name) => !chosenCountries.includes(name)
        );
        LayoutAnimation.linear();
        setFetchedData(namesNotChosen);
      }
    }

    fetchData();
  }, [chosenCountries]);

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
    navigation.navigate('Locations');
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
          mode={ButtonMode.flat}
        >
          Add Country
        </Button>
      </>
    );
  }

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={styles.outerContainer}
    >
      <Pressable onPress={onCloseModal}>{content}</Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 140,
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
  },
});

export default Selection;
