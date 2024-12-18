import { ReactElement, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { GlobalStyles } from '../../../constants/styles';
import IconButton from '../../UI/IconButton';
import { Icons } from '../../../models';
import TagCloud from '../../UI/TagCloud';
import Selection from './Selection';
import { fetchCustomCountries } from '../../../utils/http/custom_country';
import { generateRandomString } from '../../../utils';

interface CountriesSelectionProps {
  onAddCountry: (countryName: string) => void;
  onDeleteCountry: (countryName: string) => void;
}

const CountriesSelection: React.FC<CountriesSelectionProps> = ({
  onAddCountry,
  onDeleteCountry,
}): ReactElement => {
  const [openSelection, setOpenSelection] = useState(false);
  const [countryNames, setCountryNames] = useState<string[]>([]);

  function handleAddCountry(countryName: string) {
    onAddCountry(countryName);
    setCountryNames([...countryNames, countryName]);
  }

  function handleDeleteCountry(countryName: string) {
    onDeleteCountry(countryName);
    setCountryNames(countryNames.filter((name) => name !== countryName));
  }

  function handleOutsidePress() {
    setOpenSelection(false);
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Countries</Text>
      </View>
      {countryNames.length > 0 && (
        <View style={styles.cloudContainer}>
          {countryNames.map((name) => (
            <TagCloud
              text={name}
              onPress={() => handleDeleteCountry(name)}
              key={generateRandomString()}
            />
          ))}
        </View>
      )}
      <IconButton
        icon={Icons.add}
        onPress={() => setOpenSelection((prevValue) => !prevValue)}
      />
      {openSelection && (
        <Selection
          chosenCountries={countryNames}
          onAddHandler={handleAddCountry}
          onCloseModal={handleOutsidePress}
          onFetchRequest={fetchCustomCountries}
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
});

export default CountriesSelection;
