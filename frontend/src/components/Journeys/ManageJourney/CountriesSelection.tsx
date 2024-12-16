import { ReactElement, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlobalStyles } from '../../../constants/styles';
import IconButton from '../../UI/IconButton';
import { Icons } from '../../../models';
import TagCloud from '../../UI/TagCloud';

interface CountriesSelectionProps {}

const CountriesSelection: React.FC<
  CountriesSelectionProps
> = (): ReactElement => {
  const [openSelection, setOpenSelection] = useState(false);
  const [countryNames, setCountryNames] = useState<string[]>([]);

  function handleAddCountry(countryName: string) {
    setCountryNames([...countryNames, countryName]);
  }

  function handleDeleteCountry(countryName: string) {
    setCountryNames(countryNames.filter((name) => name !== countryName));
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Countries</Text>
      </View>
      <View style={styles.cloudContainer}>
        <TagCloud
          text='Germany'
          onPress={() => handleDeleteCountry('Germany')}
        />
      </View>
      <IconButton icon={Icons.add} onPress={() => setOpenSelection(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
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
