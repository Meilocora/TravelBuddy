import { createContext, useState } from 'react';

import {
  Activity,
  Journey,
  MajorStage,
  MinorStage,
  PlaceToVisit,
  Transportation,
} from '../models';
import { fetchStagesData } from '../utils/http';

interface ActiveHeader {
  minorStageId?: number;
  header?: string;
}

interface StagesContextType {
  journeys: Journey[];
  fetchUserData: () => Promise<void | string>;
  findJourney: (journeyId: number) => Journey | undefined;
  findMajorStage: (majorStageId: number) => MajorStage | undefined;
  findMinorStage: (minorStageId: number) => MinorStage | undefined;
  findMajorStagesJourney: (majorStageId: number) => Journey | undefined;
  findMinorStagesMajorStage: (minorStageId: number) => MajorStage | undefined;
  findActivity: (
    minorStageName: string,
    activityId: number
  ) => { minorStageId: number; activity: Activity | undefined } | undefined;
  findPlaceToVisit: (
    minorStageName: string,
    placeId: number
  ) => PlaceToVisit | undefined;
  findTransportation: (
    majorStageName: string,
    minorStageName?: string
  ) =>
    | {
        minorStageId: number | undefined;
        majorStageId: number | undefined;
        transportation: Transportation | undefined;
      }
    | undefined;
  selectedJourneyId?: number;
  setSelectedJourneyId: (id: number) => void;
  activeHeader: ActiveHeader;
  setActiveHeaderHandler: (minorStageId: number, header: string) => void;
}

export const StagesContext = createContext<StagesContextType>({
  journeys: [],
  fetchUserData: async () => {},
  findJourney: () => undefined,
  findMajorStage: () => undefined,
  findMinorStage: () => undefined,
  findMajorStagesJourney: () => undefined,
  findMinorStagesMajorStage: () => undefined,
  findActivity: () => undefined,
  findPlaceToVisit: () => undefined,
  findTransportation: () => undefined,
  selectedJourneyId: undefined,
  setSelectedJourneyId: () => {},
  activeHeader: {},
  setActiveHeaderHandler(minorStageId, header) {},
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
  const [activeHeader, setActiveHeader] = useState<ActiveHeader>({
    minorStageId: undefined,
    header: undefined,
  });

  async function fetchUserData(): Promise<void | string> {
    const response = await fetchStagesData();

    if (response.journeys) {
      setJourneys(response.journeys);
    } else {
      return response.error;
    }
  }

  function findJourney(journeyId: number) {
    const journey = journeys.find((journey) => journey.id === journeyId);
    return journey;
  }

  function findMajorStage(majorStageId: number) {
    if (majorStageId === 0) {
      return undefined;
    }

    if (Array.isArray(journeys)) {
      for (const key in journeys) {
        const journey = journeys[key];

        const majorStage = journey.majorStages?.find(
          (majorStage) => majorStage.id === majorStageId
        );
        if (majorStage) {
          return majorStage;
        }
      }
    } else {
      return;
    }
  }

  function findMinorStage(minorStageId: number) {
    if (minorStageId === 0) {
      return undefined;
    }

    for (const journey of journeys) {
      for (const majorStage of journey.majorStages || []) {
        const minorStage = majorStage.minorStages?.find(
          (minorStage) => minorStage.id === minorStageId
        );
        if (minorStage) {
          return minorStage;
        }
      }
    }

    return undefined;
  }

  function findMajorStagesJourney(majorStageId: number) {
    if (majorStageId === 0) {
      return undefined;
    }

    if (Array.isArray(journeys)) {
      for (const key in journeys) {
        const journey = journeys[key];

        const majorStage = journey.majorStages?.find(
          (majorStage) => majorStage.id === majorStageId
        );
        if (majorStage) {
          return journey;
        }
      }
    } else {
      return journeys[0];
    }
  }

  function findMinorStagesMajorStage(minorStageId: number) {
    if (minorStageId === 0) {
      return undefined;
    }

    for (const journey of journeys) {
      for (const majorStage of journey.majorStages || []) {
        const minorStage = majorStage.minorStages?.find(
          (minorStage) => minorStage.id === minorStageId
        );
        if (minorStage) {
          return majorStage;
        }
      }
    }

    return undefined;
  }

  function findActivity(minorStageName: string, activityId: number) {
    for (const journey of journeys) {
      for (const majorStage of journey.majorStages || []) {
        const minorStage = majorStage.minorStages?.find(
          (minorStage) => minorStage.title === minorStageName
        );
        if (minorStage) {
          const activity = minorStage.activities!.find(
            (activity) => activity.id === activityId
          );
          return { minorStageId: minorStage.id, activity };
        }
      }
    }
  }

  function findPlaceToVisit(minorStageName: string, placeId: number) {
    for (const journey of journeys) {
      for (const majorStage of journey.majorStages || []) {
        const minorStage = majorStage.minorStages?.find(
          (minorStage) => minorStage.title === minorStageName
        );
        if (minorStage) {
          return minorStage.placesToVisit!.find(
            (place) => place.id === placeId
          );
        }
      }
    }
  }

  function findTransportation(majorStageName: string, minorStageName?: string) {
    if (!minorStageName) {
      for (const journey of journeys) {
        const majorStage = journey.majorStages?.find(
          (majorStage) => majorStage.title === majorStageName
        );
        if (majorStage) {
          return {
            minorStageId: undefined,
            majorStageId: majorStage.id,
            transportation: majorStage.transportation,
          };
        }
      }
    } else {
      for (const journey of journeys) {
        for (const majorStage of journey.majorStages || []) {
          const minorStage = majorStage.minorStages?.find(
            (minorStage) => minorStage.title === minorStageName
          );
          if (minorStage) {
            return {
              minorStageId: minorStage.id,
              majorStageId: undefined,
              transportation: minorStage.transportation,
            };
          }
        }
      }
    }
  }

  function setActiveHeaderHandler(minorStageId: number, header: string) {
    setActiveHeader({ minorStageId, header });
  }

  const value = {
    journeys,
    fetchUserData,
    findJourney,
    findMajorStage,
    findMinorStage,
    findMajorStagesJourney,
    findMinorStagesMajorStage,
    findActivity,
    findPlaceToVisit,
    findTransportation,
    selectedJourneyId,
    setSelectedJourneyId,
    activeHeader,
    setActiveHeaderHandler,
  };

  return (
    <StagesContext.Provider value={value}>{children}</StagesContext.Provider>
  );
}
