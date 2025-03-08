import { createContext, useState } from 'react';

import { MajorStage, Transportation } from '../models';
import { fetchMajorStagesById } from '../utils/http';

interface MajorStageContextType {
  majorStages: MajorStage[];
  setMajorStages: (majorStages: MajorStage[]) => void;
  addMajorStage: (majorStage: MajorStage) => void;
  deleteMajorStage: (majorStageId: number) => void;
  updateMajorStage: (majorStage: MajorStage) => void;
  refetchMajorStages: (journeyId: number) => Promise<void>;
}

export const MajorStageContext = createContext<MajorStageContextType>({
  majorStages: [],
  setMajorStages: () => {},
  addMajorStage: () => {},
  deleteMajorStage: () => {},
  updateMajorStage: () => {},
  refetchMajorStages: async () => {},
});

export default function MajorStageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [majorStages, setMajorStages] = useState<MajorStage[]>([]);

  function addMajorStage(majorStage: MajorStage) {
    setMajorStages((prevMajorStages) => [...prevMajorStages, majorStage]);
  }

  function deleteMajorStage(majorStageId: number) {
    setMajorStages((prevMajorStages) =>
      prevMajorStages.filter((majorStage) => majorStage.id !== majorStageId)
    );
  }

  function updateMajorStage(updatedMajorStage: MajorStage) {
    setMajorStages((prevMajorStages) =>
      prevMajorStages.map((majorStage) =>
        majorStage.id === updatedMajorStage.id ? updatedMajorStage : majorStage
      )
    );
  }

  async function refetchMajorStages(journeyId: number): Promise<void> {
    const response = await fetchMajorStagesById(journeyId);
    if (response.majorStages) {
      setMajorStages(response.majorStages);
    }
  }

  const value = {
    majorStages,
    setMajorStages,
    addMajorStage,
    deleteMajorStage,
    updateMajorStage,
    refetchMajorStages,
  };

  return (
    <MajorStageContext.Provider value={value}>
      {children}
    </MajorStageContext.Provider>
  );
}
