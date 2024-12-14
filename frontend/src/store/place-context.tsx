import { createContext, useState } from 'react';

import { PlaceToVisit } from '../models';

interface PlaceContextType {
  placesToVisit: PlaceToVisit[];
  countryPlaces: PlaceToVisit[];
  setPlacesToVisit: (placesToVisit: PlaceToVisit[]) => void;
  addPlace: (placeToVisit: PlaceToVisit) => void;
  deletePlace: (placesToVisitId: number) => void;
  updatePlace: (placeToVisit: PlaceToVisit) => void;
  getPlacesByCountry: (countryId: number) => void;
}

export const PlaceContext = createContext<PlaceContextType>({
  placesToVisit: [],
  countryPlaces: [],
  setPlacesToVisit: () => {},
  addPlace: () => {},
  deletePlace: () => {},
  updatePlace: () => {},
  getPlacesByCountry: () => [],
});

export default function PlaceContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [placesToVisit, setPlacesToVisit] = useState<PlaceToVisit[]>([]);
  const [countryPlaces, setCountryPlaces] = useState<PlaceToVisit[]>([]);

  function addPlace(place: PlaceToVisit) {
    setPlacesToVisit((prevPlaces) => [...prevPlaces, place]);
  }

  function deletePlace(placesToVisitId: number) {
    setPlacesToVisit((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== placesToVisitId)
    );
  }

  function updatePlace(updatedPlace: PlaceToVisit) {
    setPlacesToVisit((prevPlaces) =>
      prevPlaces.map((place) =>
        place.id === updatedPlace.id ? updatedPlace : place
      )
    );
  }

  function getPlacesByCountry(countryId: number) {
    const foundPlaces = placesToVisit.filter(
      (place) => place.countryId === countryId
    );
    setCountryPlaces(foundPlaces);
  }

  const value = {
    placesToVisit,
    countryPlaces,
    setPlacesToVisit,
    addPlace,
    deletePlace,
    updatePlace,
    getPlacesByCountry,
  };

  return (
    <PlaceContext.Provider value={value}>{children}</PlaceContext.Provider>
  );
}
