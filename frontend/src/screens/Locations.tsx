import { ReactElement } from 'react';
import { Text } from 'react-native';

import InfoText from '../components/UI/InfoText';

interface locations {}

const Locations: React.FC = (): ReactElement => {
  return <InfoText content='Your Locations' />;
};

export default Locations;
