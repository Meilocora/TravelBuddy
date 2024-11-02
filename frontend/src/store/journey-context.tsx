import { createContext, useState } from 'react';

import { Journey } from '../models';

interface JourneyContextType {
  journeys: Journey[];
  setJourneys: (journeys: Journey[]) => void;
  addJourney: (journey: Journey) => void;
  deleteJourney: (journeyId: number) => void;
  updateJourney: (journey: Journey) => void;
}

export const JourneyContext = createContext<JourneyContextType>({
  journeys: [],
  setJourneys: () => {},
  addJourney: () => {},
  deleteJourney: () => {},
  updateJourney: () => {},
});

export default function JourneyContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [journeys, setJourneys] = useState<Journey[]>([]);

  function addJourney(journey: Journey) {
    setJourneys((prevJourneys) => [...prevJourneys, journey]);
  }

  function deleteJourney(journeyId: number) {
    setJourneys((prevJourneys) =>
      prevJourneys.filter((journey) => journey.id !== journeyId)
    );
  }

  function updateJourney(updatedJourney: Journey) {
    setJourneys((prevJourneys) =>
      prevJourneys.map((journey) =>
        journey.id === updatedJourney.id ? updatedJourney : journey
      )
    );
  }

  const value = {
    journeys,
    setJourneys,
    addJourney,
    deleteJourney,
    updateJourney,
  };

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  );
}
