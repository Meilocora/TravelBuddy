import { ReactElement, useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CustomCountries from '../components/Locations/CustomCountries';
import { CustomCountryContext } from '../store/custom-country-context';
import { fetchCustomCountries } from '../utils/http/custom_country';

interface LocationsProps {}

const Locations: React.FC = (): ReactElement => {
  const customCountryCtx = useContext(CustomCountryContext);

  // TODO: Add LeftTop to add new Country with SearchElement
  // TODO: Add Filtercriteria (not visited, by number of places, by subregion)
  // TODO: Add Searchbar

  useEffect(() => {
    async function getCustomCountries() {
      const { data } = await fetchCustomCountries();
      customCountryCtx.setCustomCountries(data || []);
    }

    getCustomCountries();
  }, []);

  return (
    <View style={styles.container}>
      <CustomCountries />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Locations;
