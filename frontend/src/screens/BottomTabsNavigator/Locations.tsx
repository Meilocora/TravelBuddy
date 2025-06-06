import { ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import CustomCountries from '../../components/Locations/CustomCountries';
import { CustomCountryContext } from '../../store/custom-country-context';
import { fetchCustomCountries } from '../../utils/http/custom_country';
import { RouteProp } from '@react-navigation/native';
import { BottomTabsParamList } from '../../models';
import Popup from '../../components/UI/Popup';

interface LocationsProps {
  route: RouteProp<BottomTabsParamList, 'Locations'>;
}

const Locations: React.FC<LocationsProps> = ({ route }): ReactElement => {
  const [popupText, setPopupText] = useState<string | null>();
  const customCountryCtx = useContext(CustomCountryContext);

  useEffect(() => {
    async function getCustomCountries() {
      const { data } = await fetchCustomCountries();
      customCountryCtx.setCustomCountries(data || []);
    }

    getCustomCountries();
  }, []);

  useEffect(() => {
    function activatePopup() {
      if (route.params?.popupText) {
        setPopupText(route.params?.popupText);
      }
    }

    activatePopup();
  }, [route.params]);

  function handleClosePopup() {
    setPopupText(null);
  }

  return (
    <View style={styles.root}>
      {popupText && <Popup content={popupText} onClose={handleClosePopup} />}
      <CustomCountries />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default Locations;
