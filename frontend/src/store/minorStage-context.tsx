import { createContext, useState } from 'react';

import { MinorStage } from '../models';

interface MinorStageContextType {
  minorStages: MinorStage[];
  setMinorStages: (minorStages: MinorStage[]) => void;
  addMinorStage: (minorStage: MinorStage) => void;
  deleteMinorStage: (minorStageId: number) => void;
  updateMinorStage: (minorStages: MinorStage) => void;
}

export const MinorStageContext = createContext<MinorStageContextType>({
  minorStages: [],
  setMinorStages: () => {},
  addMinorStage: () => {},
  deleteMinorStage: () => {},
  updateMinorStage: () => {},
});

export default function MinorStageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [minorStages, setMinorStages] = useState<MinorStage[]>([]);

  function addMinorStage(minorStage: MinorStage) {
    setMinorStages((prevMinorStages) => [...prevMinorStages, minorStage]);
  }

  function deleteMinorStage(minorStageId: number) {
    setMinorStages((prevMinorStages) =>
      prevMinorStages.filter((minorStage) => minorStage.id !== minorStageId)
    );
  }

  function updateMinorStage(updatedMinorStage: MinorStage) {
    setMinorStages((prevMinorStages) =>
      prevMinorStages.map((minorStage) =>
        minorStage.id === updatedMinorStage.id ? updatedMinorStage : minorStage
      )
    );
  }

  const value = {
    minorStages,
    setMinorStages,
    addMinorStage,
    deleteMinorStage,
    updateMinorStage,
  };

  return (
    <MinorStageContext.Provider value={value}>
      {children}
    </MinorStageContext.Provider>
  );
}
