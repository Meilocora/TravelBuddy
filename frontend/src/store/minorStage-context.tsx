import { createContext, useState } from 'react';

import { MinorStage } from '../models';
import { fetchMinorStagesById } from '../utils';

interface ActiveHeader {
  minorStageId?: number;
  header?: string;
}

interface MinorStageContextType {
  minorStages: MinorStage[];
  setMinorStages: (minorStages: MinorStage[]) => void;
  activeHeader: ActiveHeader;
  setActiveHeaderHandler: (minorStageId: number, header: string) => void;
  addMinorStage: (minorStage: MinorStage) => void;
  deleteMinorStage: (minorStageId: number) => void;
  updateMinorStage: (minorStages: MinorStage) => void;
  refetchMinorStages: (majorStageId: number) => Promise<void>;
  toggleFavoritePlace: (minorStageId: number, placeId: number) => void;
  toggleVisitedPlace?: (minorStageId: number, placeId: number) => void;
}

export const MinorStageContext = createContext<MinorStageContextType>({
  minorStages: [],
  setMinorStages: () => {},
  activeHeader: {},
  setActiveHeaderHandler(minorStageId, header) {},
  addMinorStage: () => {},
  deleteMinorStage: () => {},
  updateMinorStage: () => {},
  refetchMinorStages: async () => {},
  toggleFavoritePlace: () => {},
  toggleVisitedPlace: () => {},
});

export default function MinorStageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [minorStages, setMinorStages] = useState<MinorStage[]>([]);
  const [activeHeader, setActiveHeader] = useState<ActiveHeader>({
    minorStageId: undefined,
    header: undefined,
  });

  function setActiveHeaderHandler(minorStageId: number, header: string) {
    setActiveHeader({ minorStageId, header });
  }

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

  async function refetchMinorStages(majorStageId: number): Promise<void> {
    const response = await fetchMinorStagesById(majorStageId);

    if (response.minorStages) {
      setMinorStages(response.minorStages);
    }
  }

  function toggleFavoritePlace(minorStageId: number, placeId: number) {
    setMinorStages((prevMinorStages) =>
      prevMinorStages.map((minorStage) => {
        if (minorStage.id === minorStageId) {
          return {
            ...minorStage,
            placesToVisit: minorStage.placesToVisit?.map((place) => {
              if (place.id === placeId) {
                return { ...place, favorite: !place.favorite };
              }
              return place;
            }),
          };
        }
        return minorStage;
      })
    );
  }

  function toggleVisitedPlace(minorStageId: number, placeId: number) {
    setMinorStages((prevMinorStages) =>
      prevMinorStages.map((minorStage) => {
        if (minorStage.id === minorStageId) {
          return {
            ...minorStage,
            placesToVisit: minorStage.placesToVisit?.map((place) => {
              if (place.id === placeId) {
                return { ...place, visited: !place.visited };
              }
              return place;
            }),
          };
        }
        return minorStage;
      })
    );
  }

  const value = {
    minorStages,
    setMinorStages,
    activeHeader,
    setActiveHeaderHandler,
    addMinorStage,
    deleteMinorStage,
    updateMinorStage,
    refetchMinorStages,
    toggleFavoritePlace,
    toggleVisitedPlace,
  };

  return (
    <MinorStageContext.Provider value={value}>
      {children}
    </MinorStageContext.Provider>
  );
}
