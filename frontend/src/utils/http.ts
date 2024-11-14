import axios, { AxiosResponse } from 'axios';

import {
  Journey,
  JourneyFormValues,
  JourneyValues,
  MajorStage,
  MinorStage,
} from '../models';

const BACKEND_URL = 'http://192.168.178.32:3000';

interface FetchJourneyBackendResponse {
  journeys?: Journey[];
  status: number;
  error?: string;
}

interface FetchJourneysResponse {
  journeys?: Journey[];
  status: number;
  error?: string;
}

export const fetchJourneys = async (): Promise<FetchJourneysResponse> => {
  try {
    const response: AxiosResponse<FetchJourneyBackendResponse> =
      await axios.get(`${BACKEND_URL}/get-journeys`);

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    const { journeys, status } = response.data;

    if (!journeys) {
      return { status };
    }

    return { journeys, status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not fetch journeys!' };
  }
};

interface JourneyCreationResponse {
  journey?: Journey;
  journeyFormValues?: JourneyFormValues;
  status: number;
  error?: string;
}

export const createJourney = async (
  journeyFormValues: JourneyFormValues
): Promise<JourneyCreationResponse> => {
  try {
    const response: AxiosResponse<JourneyCreationResponse> = await axios.post(
      `${BACKEND_URL}/create-journey`,
      journeyFormValues
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    if (response.data.journeyFormValues) {
      return {
        journeyFormValues: response.data.journeyFormValues,
        status: response.data.status,
      };
    }

    return { journey: response.data.journey, status: response.data.status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not create journey!' };
  }
};

interface MajorStageResponse {
  majorStages?: MajorStage[];
  status: number;
  error?: string;
}

interface FetchMajorStagesResponse {
  majorStages?: MajorStage[];
  status: number;
  error?: string;
}

export const fetchMajorStagesById = async (
  id: number
): Promise<FetchMajorStagesResponse> => {
  try {
    const response: AxiosResponse<MajorStageResponse> = await axios.get(
      `${BACKEND_URL}/get-major-stages/${id}`
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    const { majorStages, status } = response.data;

    if (!majorStages) {
      return { status };
    }

    // const typedMajorStages: MajorStage[] = majorStages.map((majorStage) => {
    //   // TODO: maybe just spread operator?
    //   return {
    //     id: majorStage.id,
    //     title: majorStage.title,
    //     country: majorStage.country,
    //     ...(majorStage.transportation && {
    //       transportation: {
    //         type: majorStage.transportation.type,
    //         start_time: majorStage.transportation.start_time,
    //         arrival_time: majorStage.transportation.arrival_time,
    //         place_of_departure: majorStage.transportation.place_of_departure,
    //         place_of_arrival: majorStage.transportation.place_of_arrival,
    //         transportation_costs:
    //           majorStage.transportation.transportation_costs,
    //         link: majorStage.transportation.link,
    //       },
    //     }),
    //     done: majorStage.done,
    //     scheduled_start_time: majorStage.scheduled_start_time,
    //     scheduled_end_time: majorStage.scheduled_end_time,
    //     costs: {
    //       available_money: majorStage.costs.available_money,
    //       planned_costs: majorStage.costs.planned_costs,
    //       money_exceeded: majorStage.costs.money_exceeded,
    //     },
    //     minorStagesIds: majorStage.minorStagesIds,
    //   };
    // });

    return { majorStages, status };
  } catch (error) {
    // Error from frontend
    return { status: 500, error: 'Could not fetch journeys!' };
  }
};

interface MinorStageResponse {
  minorStages?: MinorStage[];
  status: number;
  error?: string;
}

interface FetchMinorStagesResponse {
  minorStages?: MinorStage[];
  status: number;
  error?: string;
}

export const fetchMinorStagesById = async (
  id: number
): Promise<FetchMinorStagesResponse> => {
  try {
    const response: AxiosResponse<MinorStageResponse> = await axios.get(
      `${BACKEND_URL}/get-minor-stages/${id}`
    );

    // Error from backend
    if (response.data.error) {
      return { status: response.data.status, error: response.data.error };
    }

    const { minorStages, status } = response.data;

    if (!minorStages) {
      return { status };
    }

    // const typedMinorStages: MinorStage[] = minorStages.map((minorStage) => {
    //   // TODO: maybe just spread operator?
    //   return {
    //     id: minorStage.id,
    //     title: minorStage.title,
    //     ...(minorStage.baseLocation && {
    //       baseLocation: {
    //         name: minorStage.baseLocation.name,
    //         description: minorStage.baseLocation.description,
    //         place: minorStage.baseLocation.place,
    //         costs: minorStage.baseLocation.costs,
    //         booked: minorStage.baseLocation.booked,
    //         link: minorStage.baseLocation.link,
    //       },
    //     }),
    //     placesToVisit: minorStage.placesToVisit?.map((place) => ({
    //       name: place.name,
    //       description: place.description,
    //       visited: place.visited,
    //       favorite: place.favorite,
    //       link: place.link,
    //     })),
    //     activities: minorStage.activities?.map((activity) => ({
    //       name: activity.name,
    //       description: activity.description,
    //       costs: activity.costs,
    //       booked: activity.booked,
    //       place: activity.place,
    //       link: activity.link,
    //     })),
    //     done: minorStage.done,
    //     scheduled_start_time: new Date(minorStage.scheduled_start_time),
    //     scheduled_end_time: new Date(minorStage.scheduled_end_time),
    //     costs: {
    //       available_money: minorStage.costs.available_money,
    //       planned_costs: minorStage.costs.planned_costs,
    //       money_exceeded: minorStage.costs.money_exceeded,
    //     },
    //   };
    // });

    return { minorStages, status };
  } catch (error) {
    // Error from frontend

    return { status: 500, error: 'Could not fetch major stages!' };
  }
};
