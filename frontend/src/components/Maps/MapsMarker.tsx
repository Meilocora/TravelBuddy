import { ReactElement } from 'react';
import { Marker } from 'react-native-maps';

interface MapsMarkerProps {
  lat: number;
  lng: number;
}

const MapsMarker: React.FC<MapsMarkerProps> = ({ lat, lng }): ReactElement => {
  let selectedLocation = {
    lat: lat ? lat : undefined,
    lng: lng ? lng : undefined,
  };

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
