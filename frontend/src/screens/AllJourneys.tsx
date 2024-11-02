import React, { ReactElement } from 'react';

import JourneysList from '../components/Journeys/JourneysList';
import { JOURNEYS } from '../dummy_backend/journeys';
// TODO: Fetch Journeys from API

interface AllJourneysProps {}

const AllJourneys: React.FC<AllJourneysProps> = (): ReactElement => {
  return <JourneysList journeys={JOURNEYS} />;
};

export default AllJourneys;
