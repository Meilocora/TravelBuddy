import { createContext, useState } from 'react';

import { Journey, MajorStage, MinorStage } from '../models';
import { fetchJourneys, fetchStagesData } from '../utils/http';

interface StagesContextType {
  journeys: Journey[];
  fetchUserData: () => Promise<void | string>;
  addJourney: (journey: Journey) => void;
  deleteJourney: (journeyId: number) => void;
  updateJourney: (journey: Journey) => void;
  selectedJourneyId?: number;
  setSelectedJourneyId: (id: number) => void;

  // addMajorStage: (journeyId: number, majorStage: MajorStage) => void;
  // deleteMajorStage: (journeyId: number, majorStageId: number) => void;
  // updateMajorStage: (journeyId: number, majorStage: MajorStage) => void;

  // addMinorStage: (
  //   journeyId: number,
  //   majorStageId: number,
  //   minorStage: MinorStage
  // ) => void;
  // deleteMinorStage: (
  //   journeyId: number,
  //   majorStageId: number,
  //   minorStageId: number
  // ) => void;
  // updateMinorStage: (
  //   journeyId: number,
  //   majorStageId: number,
  //   minorStage: MinorStage
  // ) => void;
}

export const StagesContext = createContext<StagesContextType>({
  journeys: [],
  fetchUserData: async () => {},
  addJourney: () => {},
  deleteJourney: () => {},
  updateJourney: () => {},
  selectedJourneyId: undefined,
  setSelectedJourneyId: () => {},
});

export default function StagesContextProvider({
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

  async function fetchUserData(): Promise<void | string> {
    const response = await fetchStagesData();

    if (response.journeys) {
      setJourneys(response.journeys);
    } else {
      return response.error;
    }
  }

  const value = {
    journeys,
    fetchUserData,
    addJourney,
    deleteJourney,
    updateJourney,
    selectedJourneyId,
    setSelectedJourneyId,
  };

  return (
    <StagesContext.Provider value={value}>{children}</StagesContext.Provider>
  );
}
