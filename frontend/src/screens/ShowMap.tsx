import 'react-native-get-random-values';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, ViewStyle } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import MapView, { Marker, Region } from 'react-native-maps';

import { StackParamList } from '../models';
import { GlobalStyles } from '../constants/styles';

interface ShowMapProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ShowMap'>;
  route: RouteProp<StackParamList, 'ShowMap'>;
}

const ShowMap: React.FC<ShowMapProps> = ({
  navigation,
  route,
}): ReactElement => {
  const title = route.params?.title;
  const latitude = route.params!.lat;
  const longitude = route.params!.lng;

  const region: Region = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.04,
  };

  let headerstyle = { backgroundColor: GlobalStyles.colors.primary500 };
  if (route.params?.colorScheme === 'complementary') {
    headerstyle = { backgroundColor: GlobalStyles.colors.complementary700 };
  }
  if (route.params?.colorScheme === 'accent') {
    headerstyle = { backgroundColor: GlobalStyles.colors.accent700 };
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Map',
      headerStyle: headerstyle,
    });
  }, []);

  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={region!}
        region={region}
        onPress={() => {}}
        style={styles.map}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
        />
      </MapView>
      {title && (
        // TODO: Rework this to use a better approach for positioning the title
        <View
          style={[
            styles.titleContainer,
            {
              top: height / 2,
              left: width / 2 - title.length * 5,
              transform: [{ translateY: -height / 25 }],
            },
          ]}
        >
          <Text style={styles.titleText}>{title}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modal: {
    marginTop: '25%',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    zIndex: 1,
    position: 'absolute',
    backgroundColor: GlobalStyles.colors.gray700,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default ShowMap;
