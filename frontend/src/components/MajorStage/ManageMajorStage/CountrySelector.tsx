import { ReactElement, useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { GlobalStyles } from '../../../constants/styles';
import IconButton from '../../UI/IconButton';
import { Icons } from '../../../models';
import { fetchJourneysCustomCountries } from '../../../utils/http/custom_country';
import Selection from '../../Journeys/ManageJourney/Selection';

interface CountrySelectorProps {
  onAddCountry: (countryName: string) => void;
  onDeleteCountry: (countryName: string) => void;
  invalid: boolean;
  defaultCountryNames?: string[];
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  onAddCountry,
  onDeleteCountry,
  invalid,
  defaultCountryNames,
}): ReactElement => {
  const [isInvalid, setIsInvalid] = useState<boolean>(invalid);
  const [openSelection, setOpenSelection] = useState(false);
  const [countryNames, setCountryNames] = useState<string[]>([]);

  // Synchronize state with prop changes
  useEffect(() => {
    setIsInvalid(invalid);
    setCountryNames(defaultCountryNames || []);
  }, [invalid]);

  function handleAddCountry(countryName: string) {
    onAddCountry(countryName);
    setCountryNames([...countryNames, countryName]);
  }

  function handleDeleteCountry(countryName: string) {
    onDeleteCountry(countryName);
    setCountryNames(countryNames.filter((name) => name !== countryName));
  }

  function handleCloseModal() {
    setOpenSelection(false);
    Keyboard.dismiss();
  }

  function handlePressAdd() {
    setIsInvalid(false);
    setOpenSelection((prevValue) => !prevValue);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Countries</Text>
      </View>
      {isInvalid && (
        <View>
          <Text style={styles.errorText}>Please select a country</Text>
        </View>
      )}
      {countryNames.length > 0 && (
        <View style={styles.cloudContainer}>
          {/* TODO: Show selected country here */}
        </View>
      )}
      <IconButton icon={Icons.add} onPress={handlePressAdd} />
      {openSelection && (
        <Selection
          chosenCountries={countryNames}
          onAddHandler={handleAddCountry}
          onCloseModal={handleCloseModal}
          onFetchRequest={fetchJourneysCustomCountries}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outside: {
    flex: 1,
    height: '100%',
  },
  container: {
    flex: 1,
    marginVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    borderTopWidth: 3,
    borderTopColor: GlobalStyles.colors.gray200,
    width: '95%',
    paddingVertical: 8,
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    color: GlobalStyles.colors.gray50,
  },
  cloudContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  errorText: {
    fontSize: 16,
    color: GlobalStyles.colors.error200,
    fontStyle: 'italic',
  },
});

export default CountrySelector;
