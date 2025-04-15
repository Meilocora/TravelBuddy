import { ReactElement, useState } from 'react';
import { Marker } from 'react-native-maps';
import { parseMapsLink } from '../../utils';

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
  let selectedLocation = {
    lat: lat ? lat : undefined,
    lng: lng ? lng : undefined,
  };

  if (mapsLink) {
    const { lat, lng } = parseMapsLink(mapsLink);

    selectedLocation = {
      lat: lat,
      lng: lng,
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
