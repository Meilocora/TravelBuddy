import { ReactElement, useContext, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, LayoutAnimation } from 'react-native';

import {
  BottomTabsParamList,
  Icons,
  ManageCustomCountryRouteProp,
  StackParamList,
} from '../models';
import { CustomCountryContext } from '../store/custom-country-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GlobalStyles } from '../constants/styles';
import CustomCountryForm from '../components/Locations/ManageLocation/CustomCountryForm';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import {
  DeleteCustomCountryProps,
  UpdateCustomCountryProps,
} from '../utils/http/custom_country';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import PlacesList from '../components/Locations/Places/PlacesList';

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
  const [isShowingPlaces, setIsShowingPlaces] = useState(false);

  const customCountryCtx = useContext(CustomCountryContext);
  const countryId = route.params.countryId;

  const country = customCountryCtx.customCountries.find(
    (country) => country.id === countryId
  );
  if (!country && !error) {
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
  }, [navigation, isEditing]);

  function handleChangeEdit() {
    // TODO: Improve Animation...
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing((prevValue) => !prevValue);
  }

  function handleUpdateCountry(response: UpdateCustomCountryProps) {
    const { status, error, customCountry } = response;

    if (error) {
      setError(error);
    } else if (status === 200 && customCountry) {
      customCountryCtx.updateCustomCountry(customCountry);
      setIsEditing(false);
    }
  }

  const secondaryNavigation =
    useNavigation<NavigationProp<BottomTabsParamList>>();

  function handleDeleteCountry(response: DeleteCustomCountryProps) {
    const { status, error } = response;
    if (error) {
      setError(error);
    } else if (status === 200) {
      customCountryCtx.deleteCustomCountry(countryId);
      const popupText = 'Custom Country successfully deleted!';
      secondaryNavigation.navigate('Locations', { popupText: popupText });
    }
  }

  function handleTogglePlaces() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsShowingPlaces((prevState) => !prevState);
  }

  return (
    <>
      {isShowingPlaces && <PlacesList onCancel={handleTogglePlaces} />}
      <View style={styles.root}>
        {error && (
          <ErrorOverlay message={error} onPress={() => setError(null)} />
        )}

        {country && (
          <CustomCountryForm
            country={country}
            isEditing={isEditing}
            onUpdate={handleUpdateCountry}
            onDelete={handleDeleteCountry}
            handleTogglePlaces={handleTogglePlaces}
            isShowingPlaces={isShowingPlaces}
          />
        )}
      </View>
    </>
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
