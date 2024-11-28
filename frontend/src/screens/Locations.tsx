import { ReactElement, useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CustomCountries from '../components/Locations/CustomCountries';
import { CustomCountryContext } from '../store/custom-country-context';
import { fetchCustomCountries } from '../utils/http/custom_country';

interface LocationsProps {}

const Locations: React.FC = (): ReactElement => {
  const customCountryCtx = useContext(CustomCountryContext);

  useEffect(() => {
    async function getCustomCountries() {
      const { data } = await fetchCustomCountries();
      console.log(data);
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
