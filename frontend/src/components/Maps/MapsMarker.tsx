import { ReactElement } from 'react';
import { Marker } from 'react-native-maps';

interface MapsMarkerProps {
  name?: string;
  lat: number;
  lng: number;
}

const MapsMarker: React.FC<MapsMarkerProps> = ({ lat, lng }): ReactElement => {
  let selectedLocation = {
    lat: lat ? lat : undefined,
    lng: lng ? lng : undefined,
  };

  // locationType = ['accommodation', 'activity', 'transportation_departure', 'transportation_arrival', 'place'] <== find symbols for each of them

  return (
    <Marker
      title='Picked Location'
      coordinate={{
        latitude: selectedLocation.lat!,
        longitude: selectedLocation.lng!,
      }}
    />
  );
};

export default MapsMarker;
