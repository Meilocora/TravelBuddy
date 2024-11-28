import { Text, View, StyleSheet, Pressable, Platform } from 'react-native';

import { CustomCountry } from '../../models';
import { GlobalStyles } from '../../constants/styles';
import { Icons } from '../../models';
import GridInfoLine from './GridInfoLine';

interface CountryGridTileProps {
  country: CustomCountry;
}

const CountryGridTile: React.FC<CountryGridTileProps> = ({ country }) => {
  // TODO: Format lamguages
  // TODO: Format population (k, mio)
  // TODO: Dynamically display values, when exist

  return (
    <View style={styles.container}>
      <Pressable
        android_ripple={{ color: GlobalStyles.colors.accent100 }}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{country.name}</Text>
          <GridInfoLine icon={Icons.capital} value={country.capital} />
          <GridInfoLine icon={Icons.language} value={country.languages} />
          <GridInfoLine icon={Icons.currency} value={country.currencies} />
          <GridInfoLine
            icon={Icons.population}
            value={country.population.toString()}
          />
          <GridInfoLine
            icon={Icons.placesToVisit}
            value={country.placesToVisit?.length.toString() || '0'}
          />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '40%',
    height: 175,
    marginVertical: 10,
    marginHorizontal: 'auto',
    borderWidth: 1,
    borderColor: GlobalStyles.colors.gray100,
    borderRadius: 10,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  innerContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GlobalStyles.colors.gray100,
    flexWrap: 'wrap',
    marginBottom: 6,
  },
});

export default CountryGridTile;
