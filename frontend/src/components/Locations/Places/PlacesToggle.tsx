import { ReactElement } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { GlobalStyles } from '../../../constants/styles';

interface PlacesToggleProps {
  isShowingPlaces: boolean;
  handleTogglePlaces: () => void;
}

const PlacesToggle: React.FC<PlacesToggleProps> = ({
  isShowingPlaces,
  handleTogglePlaces,
}): ReactElement => {
  return (
    <Pressable onPress={handleTogglePlaces} style={styles.container}>
      <Text style={[styles.text, isShowingPlaces && styles.active]}>
        Show Places to visit
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GlobalStyles.colors.gray50,
    textAlign: 'center',
  },
  active: {
    color: GlobalStyles.colors.accent200,
  },
});

export default PlacesToggle;
