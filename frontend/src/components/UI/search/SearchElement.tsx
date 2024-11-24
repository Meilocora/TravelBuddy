import { ReactElement, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Input from '../form/Input';
import Button from '../Button';
import { ColorScheme } from '../../../models';
import {
  fetchCountries,
  FetchCountriesProps,
} from '../../../utils/http/custom_country';
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
      if (debouncedCountryName !== '' && countryName.length > 2) {
        const { countries, status, error } = await fetchCountries(
          debouncedCountryName
        );

        if (!error && countries) {
          setCountries(countries);
        } else if (error) {
          setError(error);
        }
      }
      setIsLoading(false);
    }

    fetchCountriesData();
  }, [debouncedCountryName]);

  function inputChangedHandler(value: string) {
    setIsLoading(true);
    setCountryName(value);
  }

  let content: ReactElement;

  if (error) {
    content = <ErrorOverlay message={error} onPress={() => setError(null)} />;
  } else if (countries.length === 0 && countryName !== '' && !isLoading) {
    content = <InfoText content='No countries found' />;
  } else if (isLoading) {
    content = (
      <ActivityIndicator size='large' color={GlobalStyles.colors.accent200} />
    );
  } else {
    content = (
      <FlatList
        style={styles.countriesList}
        data={countries}
        renderItem={({ item }) => (
          <ListItem key={generateRandomString()} onPress={() => {}}>
            {item}
          </ListItem>
        )}
      />
    );
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
          onPress={() => {}}
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
    paddingBottom: 30,
  },
});

export default SearchElement;
