import { createContext, useState } from 'react';

import { Journey } from '../models';
import { fetchJourneys } from '../utils/http';

interface JourneyContextType {
  journeys: Journey[];
  selectedJourneyId?: number;
  setSelectedJourneyId: (id: number) => void;
  setJourneys: (journeys: Journey[]) => void;
  addJourney: (journey: Journey) => void;
  deleteJourney: (journeyId: number) => void;
  updateJourney: (journey: Journey) => void;
  refetchJourneys: () => Promise<void>;
}

export const JourneyContext = createContext<JourneyContextType>({
  journeys: [],
  selectedJourneyId: undefined,
  setSelectedJourneyId: () => {},
  setJourneys: () => {},
  addJourney: () => {},
  deleteJourney: () => {},
  updateJourney: () => {},
  refetchJourneys: async () => {},
});

export default function JourneyContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [selectedJourneyId, setSelectedJourneyId] = useState<
    number | undefined
  >(undefined);

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

  async function refetchJourneys(): Promise<void> {
    const response = await fetchJourneys();
    if (response.journeys) {
      setJourneys(response.journeys);
    }
  }

  const value = {
    journeys,
    selectedJourneyId,
    setSelectedJourneyId,
    setJourneys,
    addJourney,
    deleteJourney,
    updateJourney,
    refetchJourneys,
  };

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  );
}
