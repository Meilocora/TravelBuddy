import React, { ReactElement, useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GlobalStyles } from '../../../constants/styles';
import { ButtonMode, ColorScheme } from '../../../models';
import { fetchJourneysCustomCountries } from '../../../utils/http/custom_country';
import ListItem from '../../UI/search/ListItem';
import Input from '../../UI/form/Input';
import { generateRandomString } from '../../../utils';
import Button from '../../UI/Button';
import { BlurView } from 'expo-blur';

interface CountrySelectorProps {
  onChangeCountry: (countryName: string) => void;
  invalid: boolean;
  journeyId: number;
  defaultCountryName: string;
  errors: string[];
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  onChangeCountry,
  invalid,
  journeyId,
  defaultCountryName,
  errors,
}): ReactElement => {
  const [isInvalid, setIsInvalid] = useState<boolean>(invalid);
  const [openSelection, setOpenSelection] = useState(false);
  const [countryName, setCountryName] = useState<string>('');
  const [fetchedData, setFetchedData] = useState<string[]>([]);

  // Synchronize state with prop changes
  // TODO: This really needed? => try with editing a country
  useEffect(() => {
    setIsInvalid(invalid);
    setCountryName(defaultCountryName || '');
  }, [invalid]);

  function handleOpenModal() {
    // setIsInvalid(false);
    setOpenSelection(true);
  }

  function handleCloseModal() {
    setOpenSelection(false);
    Keyboard.dismiss();
  }

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      const { data } = await fetchJourneysCustomCountries(journeyId);
      if (data) {
        const names = data.map((item) => item.name);
        LayoutAnimation.linear();
        setFetchedData(names);
      }
    }

    fetchData();
  }, []);

  function handlePressListElement(item: string) {
    setCountryName(item);
    onChangeCountry(item);
    setOpenSelection(false);
  }

  return (
    <>
      {openSelection && (
        <BlurView style={styles.blurView} intensity={100} tint='dark'>
          <View style={styles.listContainer}>
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
                onPress={handleCloseModal}
                style={styles.button}
              >
                Dismiss
              </Button>
            </ScrollView>
          </View>
        </BlurView>
      )}
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Pressable onPress={handleOpenModal}>
            <Input
              label='Country'
              errors={errors}
              textInputConfig={{
                value: countryName,
                readOnly: true,
                placeholder: 'Pick Country',
              }}
            />
          </Pressable>
        </View>
        {isInvalid && (
          <View>
            <Text style={styles.errorText}>Please select a country</Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  outside: {
    flex: 1,
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '50%',
  },
  headerContainer: {
    width: '100%',
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    color: GlobalStyles.colors.gray50,
  },
  errorText: {
    fontSize: 16,
    color: GlobalStyles.colors.error200,
    fontStyle: 'italic',
  },
  blurView: {
    // TODO: Might Rework this , so it works for alle devices
    marginHorizontal: -24,
    marginVertical: -100,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    overflow: 'hidden',
    zIndex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  listContainer: {
    marginVertical: 'auto',
    marginHorizontal: 'auto',
  },
  list: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    width: '60%',
    maxHeight: 300,
    backgroundColor: GlobalStyles.colors.gray700,
    borderRadius: 20,
  },
  button: {
    marginVertical: 8,
    marginHorizontal: 'auto',
  },
});

export default CountrySelector;
