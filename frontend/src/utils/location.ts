import { GOOGLE_API_KEY } from '@env';
import { LatLng, Region } from 'react-native-maps';

import { Location } from './http';

export function getMapPreview({ latitude, longitude }: LatLng) {
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
  return imagePreviewUrl;
}

export async function getAddress({ latitude, longitude }: LatLng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch address!');
  }

  const data = await response.json();
  const address = data.results[0].formatted_address;

  return address;
}

export function getRegionForLocations(locations: Location[]): Region {
  if (locations.length === 0) {
    // Default region if no locations are available
    return {
      latitude: 48.1483601,
      longitude: 11.5400113,
      latitudeDelta: 0.1,
      longitudeDelta: 0.04,
    };
  }

  const latitudes = locations.map((loc) => loc.data.latitude);
  const longitudes = locations.map((loc) => loc.data.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;
  const latitudeDelta = (maxLat - minLat) * 1.2; // Add padding (20%)
  const longitudeDelta = (maxLng - minLng) * 1.2; // Add padding (20%)

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
}
