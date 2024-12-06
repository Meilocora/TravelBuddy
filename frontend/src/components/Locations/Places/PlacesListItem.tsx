import { ReactElement } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { PlaceToVisit } from '../../../models';

interface PlacesListItemProps {
  place: PlaceToVisit;
  style?: ViewStyle;
}

const PlacesListItem: React.FC<PlacesListItemProps> = ({
  place,
  style,
}): ReactElement => {
  return (
    <View style={[styles.container, style ? style : undefined]}>
      <Text>Places List Item</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginVertical: 2,
    backgroundColor: 'white',
  },
});

export default PlacesListItem;
