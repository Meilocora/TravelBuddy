import { ReactElement, useContext } from 'react';
import { StyleSheet } from 'react-native';

import SearchElement from '../UI/search/SearchElement';
import { CustomCountry } from '../../models';
import { CustomCountryContext } from '../../store/custom-country-context';
import { addCountry, fetchCountries } from '../../utils/http/custom_country';
import CountriesList from './CountriesList';

interface CustomCountriesProps {}

const CustomCountries: React.FC<CustomCountriesProps> = (): ReactElement => {
  const customCountryCtx = useContext(CustomCountryContext);

  function onAddCountry(addedItem: CustomCountry): void {
    customCountryCtx.addCustomCountry(addedItem);
  }

  return (
    <>
      <SearchElement
        onFetchRequest={fetchCountries}
        onAddHandler={onAddCountry}
        onAddRequest={addCountry}
        searchTermLabel='Country Name'
      />
      <CountriesList />
    </>
  );
};

const styles = StyleSheet.create({});

export default CustomCountries;
