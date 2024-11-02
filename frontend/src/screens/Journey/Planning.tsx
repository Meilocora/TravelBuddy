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

  return (
    <View>
      <Text>Planning</Text>
    </View>
  );
};

export default Planning;
