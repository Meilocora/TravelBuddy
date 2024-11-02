import { ReactElement, useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { MajorStage, PlanningRouteProp } from '../../models';

import { JOURNEYS } from '../../dummy_backend/journeys';
import { MINORSTAGES } from '../../dummy_backend/minorStages';
import { MAJORSTAGES } from '../../dummy_backend/majorStages';

interface PlanningProps {
  route: PlanningRouteProp;
}

const Planning: React.FC<PlanningProps> = ({ route }): ReactElement => {
  const { journeyId } = route.params;

  const [majorStages, setMajorStages] = useState<MajorStage[]>([]);

  // TODO: Fetch Data from API into Context via useEffect
  // useEffect(() => {
  //   const journey = JOURNEYS.find((j) => j.id === journeyId);

  //   if (journey) {
  //     // TODO: Backend should receive journeyId and return Journey and MajorStages with MinorStages
  //     const stages = journey.majorStagesIds
  //       .map((id) => MAJORSTAGES.find((ms) => ms.id === id))
  //       .filter((stage): stage is MajorStage => stage !== undefined); // Filter out undefined values

  //     setMajorStages(stages);
  //   }
  // }, [journeyId]);

  const [data, setdata] = useState({
    name: '',
    age: 0,
    date: '',
    programming: '',
  });

  useEffect(() => {
    fetch('http://192.168.178.32:3000/data', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <View>
      <Text>Planning</Text>
    </View>
  );
};

export default Planning;
