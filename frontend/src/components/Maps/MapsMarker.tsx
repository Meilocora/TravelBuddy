import { ReactElement } from 'react';
import { Marker } from 'react-native-maps';
import { Location } from '../../utils/http';

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
    <Marker
      title={data.name}
      coordinate={{
        latitude: data.latitude,
        longitude: data.longitude,
      }}
      // icon={require('../../../assets/bus.png')}
    />
  );
};

export default MapsMarker;
