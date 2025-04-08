import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

import {
  Activity,
  ButtonMode,
  ColorScheme,
  MinorStage,
  Transportation,
} from '../../../models';
import Button from '../Button';
import { formatAmount, formatDateTimeString } from '../../../utils';
import Link from '../Link';
import { MinorStageContext } from '../../../store/minorStage-context';
import { useContext } from 'react';
import InfoText from '../InfoText';

// interface ActivityElementInfopointProps {
//   subtitle: string;
//   data: string;
// }

// const TransportElementInfopoint: React.FC<TransportElementInfopointProps> = ({
//   subtitle,
//   data,
// }) => {
//   return (
//     <View style={styles.innerContainer}>
//       <Text style={styles.subtitle}>{subtitle}: </Text>
//       <View style={styles.data}>
//         <Text numberOfLines={1}>{data}</Text>
//       </View>
//     </View>
//   );
// };

interface ActivityElementProps {
  minorStage: MinorStage;
  handleAdd: () => void;
  handleEdit: (id: number) => void;
}

const ActivityElement: React.FC<ActivityElementProps> = ({
  minorStage,
  handleAdd,
  handleEdit,
}) => {
  // const minorStageCtx = useContext(MinorStageContext);

  const screenHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      {minorStage.activities!.length === 0 ? (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>No activities selected</Text>
        </View>
      ) : (
        <ScrollView style={{ maxHeight: screenHeight / 3 }}>
          {minorStage.activities!.map((activity) => (
            // <PlacesListItem
            //   place={place}
            //   key={generateRandomString()}
            //   onToggleFavorite={handleToggleFavourite}
            //   onToggleVisited={handleToggleVisited}
            //   onRemovePlace={handleDelete}
            // />
            <Text>{activity.name}</Text>
          ))}
        </ScrollView>
      )}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleAdd}
          colorScheme={ColorScheme.complementary}
          mode={ButtonMode.flat}
        >
          Add Activity
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityElement;
