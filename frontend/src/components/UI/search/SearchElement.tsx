import { ReactElement, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import Animated, { BounceIn } from 'react-native-reanimated';

import Input from '../form/Input';
import Button from '../Button';
import { ColorScheme } from '../../../models';
import { addCountry, fetchCountries } from '../../../utils/http/custom_country';
import { generateRandomString } from '../../../utils';
import InfoText from '../InfoText';
import { GlobalStyles } from '../../../constants/styles';
import ListItem from './ListItem';
import ErrorOverlay from '../ErrorOverlay';

interface SearchElementProps {}

const SearchElement: React.FC<SearchElementProps> = (): ReactElement => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countryName, setCountryName] = useState<string>('');
  const [countries, setCountries] = useState<string[]>([]);
  const [debouncedCountryName, setDebouncedCountryName] =
    useState<string>(countryName);

  // Activate Timer, so that the API is not called on every key stroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCountryName(countryName);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [countryName]);

  // Fetch countries data
  useEffect(() => {
    async function fetchCountriesData() {
      if (debouncedCountryName !== '' && debouncedCountryName.length > 1) {
        const { countries, status, error } = await fetchCountries(
          debouncedCountryName
        );

        if (!error && countries) {
          setCountries(countries);
        } else if (error) {
          setError(error);
        }
      } else {
        setCountries([]);
      }
      setIsLoading(false);
    }

    fetchCountriesData();
  }, [debouncedCountryName]);

  function inputChangedHandler(value: string) {
    setIsLoading(true);
    setCountryName(value);
  }

  function handlePressListElement(choosenCountryName: string) {
    setCountryName(choosenCountryName);
  }

  async function handleAddCountry() {
    const response = await addCountry(countryName);
  }

  let content: ReactElement | null = null;

  if (error) {
    content = <ErrorOverlay message={error} onPress={() => setError(null)} />;
  } else if (isLoading && debouncedCountryName.length > 1) {
    content = (
      <ActivityIndicator size='large' color={GlobalStyles.colors.accent200} />
    );
  } else if (
    debouncedCountryName.length > 1 &&
    !isLoading &&
    countries.length > 0 &&
    countries[0] !== countryName
  ) {
    // TODO: Improve Animation mit Lesezeichen
    content = (
      <Animated.FlatList
        entering={BounceIn}
        style={styles.countriesList}
        contentContainerStyle={{ paddingBottom: 10, paddingTop: 5 }}
        data={countries}
        renderItem={({ item }) => (
          <ListItem
            key={generateRandomString()}
            onPress={handlePressListElement}
          >
            {item}
          </ListItem>
        )}
      />
    );
  } else if (
    debouncedCountryName.length > 1 &&
    !isLoading &&
    countries.length === 0
  ) {
    content = <InfoText content='No countries found' />;
  }

  return (
    <View>
      <View style={styles.innerContainer}>
        <Input
          errors={[]}
          invalid={false}
          label='Country'
          textInputConfig={{
            value: countryName,
            onChangeText: inputChangedHandler,
          }}
        />
        <Button
          onPress={handleAddCountry}
          colorScheme={ColorScheme.accent}
          style={{
            marginHorizontal: 10,
            alignSelf: 'flex-end',
            marginBottom: 12,
          }}
        >
          Add
        </Button>
      </View>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 75,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  countriesList: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
    maxHeight: 240,
    maxWidth: 290,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: GlobalStyles.colors.primary500,
    backgroundColor: GlobalStyles.colors.primary800,
  },
});

export default SearchElement;
