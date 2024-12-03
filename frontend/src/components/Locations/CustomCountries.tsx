import { ReactElement, useContext, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import SearchElement from '../UI/search/SearchElement';
import { CustomCountry, Icons } from '../../models';
import { CustomCountryContext } from '../../store/custom-country-context';
import { addCountry, fetchCountries } from '../../utils/http/custom_country';
import CountriesList from './CountriesList';
import IconButton from '../UI/IconButton';

interface CustomCountriesProps {}

const CustomCountries: React.FC<CustomCountriesProps> = (): ReactElement => {
  const [isAddCountry, setIsAddCountry] = useState(false);
  const [isSetFilter, setIsSetFilter] = useState(false);
  // TODO: Implement Filter functionality
  const [isSearch, setIsSearch] = useState(false);
  // TODO: Implement Search functionality

  const customCountryCtx = useContext(CustomCountryContext);

  function onAddCountry(addedItem: CustomCountry): void {
    customCountryCtx.addCustomCountry(addedItem);
  }

  function handleTapOutside(): void {
    setIsAddCountry(false);
    setIsSetFilter(false);
    setIsSearch(false);
    Keyboard.dismiss();
  }

  return (
    <TouchableWithoutFeedback onPress={handleTapOutside}>
      <View style={styles.container}>
        {isAddCountry && (
          <SearchElement
            onFetchRequest={fetchCountries}
            onAddHandler={onAddCountry}
            onAddRequest={addCountry}
            searchTermLabel='Country Name'
          />
        )}
        <View style={styles.iconButtonsContainer}>
          <IconButton
            icon={Icons.add}
            onPress={() => setIsAddCountry((prevState) => !prevState)}
          />
          <IconButton
            icon={Icons.search}
            onPress={() => setIsSearch((prevState) => !prevState)}
          />
          <IconButton
            icon={Icons.filter}
            onPress={() => setIsSetFilter((prevState) => !prevState)}
          />
        </View>
        <CountriesList />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '70%',
    marginHorizontal: 'auto',
    marginTop: 10,
  },
});

export default CustomCountries;
