import { ReactElement, useContext, useLayoutEffect, useState } from 'react';
import { Text, View, StyleSheet, LayoutAnimation } from 'react-native';

import { Icons, ManageCustomCountryRouteProp, StackParamList } from '../models';
import { CustomCountryContext } from '../store/custom-country-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GlobalStyles } from '../constants/styles';
import CustomCountryForm from '../components/Locations/ManageLocation/CustomCountryForm';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';

interface ManageCustomCountryProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ManageCustomCountry'>;
  route: ManageCustomCountryRouteProp;
}

const ManageCustomCountry: React.FC<ManageCustomCountryProps> = ({
  route,
  navigation,
}): ReactElement => {
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const customCountryCtx = useContext(CustomCountryContext);
  const countryId = route.params.countryId;

  const country = customCountryCtx.customCountries.find(
    (country) => country.id === countryId
  );
  if (!country) {
    setError('Country not found');
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      title: 'Country Details',
      headerRight: () => (
        <IconButton
          icon={Icons.edit}
          onPress={handleChangeEdit}
          color={isEditing ? GlobalStyles.colors.accent600 : 'white'}
        />
      ),
    });
  }, [navigation, country, isEditing]);

  function handleChangeEdit() {
    // TODO: Improve Animation...
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing((prevValue) => !prevValue);
  }

  // Error handling
  // Ctx handling
  // Navigate back onConfirm (with poup)

  // TODO: Implement Functionality to add a PlaceToVisit
  return (
    <View style={styles.root}>
      {error && <ErrorOverlay message={error} onPress={() => setError(null)} />}
      {country && <CustomCountryForm country={country} isEditing={isEditing} />}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 10,
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: 'rgba(169, 169, 169, 0.2)',
    borderRadius: 10,
  },
});

export default ManageCustomCountry;
