import { Text, View } from 'react-native';
import { ReactElement } from 'react';

interface FavoritesProps {}

const Favorites: React.FC<FavoritesProps> = (): ReactElement => {
  return (
    <View>
      <Text>
        Favorite Places and Memories (Tagebuch ?!... nur auf Handy lokal
        gespeichert)
      </Text>
    </View>
  );
};

export default Favorites;
