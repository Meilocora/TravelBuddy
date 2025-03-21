import { ReactElement, useContext } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';

import { CustomCountryContext } from '../../store/custom-country-context';
import CountryGridTile from './CountryGridTile';
import InfoText from '../UI/InfoText';

interface CountriesListProps {}

const CountriesList: React.FC<CountriesListProps> = (): ReactElement => {
  const customCountryCtx = useContext(CustomCountryContext);
  const countries = customCountryCtx.customCountries;

  return (
    <View style={styles.container}>
      {countries.length > 0 && (
        <FlatList
          data={countries}
          renderItem={({ item }) => <CountryGridTile country={item} />}
          key='customCountries'
          numColumns={2}
        />
      )}
      {countries.length === 0 && <InfoText content='No countries added yet!' />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default CountriesList;
