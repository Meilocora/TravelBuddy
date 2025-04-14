import { ReactElement, useState } from 'react';
import { Marker } from 'react-native-maps';

interface MapsMarkerProps {
  lat?: number;
  lng?: number;
  mapsLink?: string;
}

const MapsMarker: React.FC<MapsMarkerProps> = ({
  lat,
  lng,
  mapsLink,
}): ReactElement => {
  // const [selectedLocation, setSelectedLocation] = useState<{
  //   lat: number | undefined;
  //   lng: number | undefined;
  // }>({
  //   lat: lat ? lat : undefined,
  //   lng: lng ? lng : undefined,
  // });

  let selectedLocation = {
    lat: lat ? lat : undefined,
    lng: lng ? lng : undefined,
  };

  if (mapsLink) {
    const latLng =
      mapsLink.split('@')[1].split(',')[0] +
      ',' +
      mapsLink.split('@')[1].split(',')[1];
    const lat = parseFloat(latLng.split(',')[0]);
    const lng = parseFloat(latLng.split(',')[1]);
    // setSelectedLocation({ lat: lat, lng: lng });
    selectedLocation = {
      lat: lat ? lat : undefined,
      lng: lng ? lng : undefined,
    };
  }

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
