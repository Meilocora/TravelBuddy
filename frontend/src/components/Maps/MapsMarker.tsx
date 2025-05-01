import { ReactElement } from 'react';
import { Marker } from 'react-native-maps';
import { Location } from '../../utils/http';

// import ActivityIcon from '../../../assets/activity.svg';
import { View } from 'react-native';

interface MapsMarkerProps {
  location: Location;
}

const MapsMarker: React.FC<MapsMarkerProps> = ({ location }): ReactElement => {
  const { stageType, belonging, locationType, transportationType, data } =
    location;

  // locationType = ['accommodation', 'activity', 'transportation_departure', 'transportation_arrival', 'place'] <== find symbols for each of them

  // const icon = {require('./YOUR_MARKER.png')}
  // https://www.flaticon.com/search?word=bus

  return (
    <>
      <Marker
        title={data.name}
        coordinate={{
          latitude: data.latitude,
          longitude: data.longitude,
        }}
        // icon={require('../../../assets/bus.png')}
      >
        <View style={{ zIndex: 10 }}>
          {/* <ActivityIcon width={30} height={30} fill='red' stroke='black' /> */}
        </View>
      </Marker>
    </>
  );
};

export default MapsMarker;
