import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';

import {
  Activity,
  ButtonMode,
  ColorScheme,
  Icons,
  MinorStage,
  StackParamList,
} from '../../../models';
import Button from '../Button';
import Link from '../Link';
import { useState } from 'react';
import { GlobalStyles } from '../../../constants/styles';
import IconButton from '../IconButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formatAmount, generateRandomString, parseDate } from '../../../utils';
import { Location, LocationType } from '../../../utils/http';

interface ActivityListElementProps {
  activity: Activity;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  isOver: boolean;
}

const ActivityListElement: React.FC<ActivityListElementProps> = ({
  activity,
  handleEdit,
  handleDelete,
  isOver,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  function handleShowLocation() {
    const location: Location = {
      belonging: 'Undefined',
      locationType: LocationType.activity,
      data: {
        name: activity.place,
        latitude: activity.latitude!,
        longitude: activity.longitude!,
      },
    };

    navigation.navigate('ShowMap', {
      location: location,
      colorScheme: 'complementary',
    });
  }

  return (
    <View style={listElementStyles.container}>
      <Pressable onPress={() => setIsOpened(!isOpened)}>
        <View style={listElementStyles.mainRow}>
          <Text
            style={listElementStyles.name}
            ellipsizeMode='tail'
            numberOfLines={1}
          >
            {activity.name}
          </Text>
          <View style={listElementStyles.buttonsContainer}>
            {activity.latitude && activity.longitude && (
              <IconButton
                icon={Icons.location}
                onPress={handleShowLocation}
                color={GlobalStyles.colors.visited}
                containerStyle={listElementStyles.button}
              />
            )}
            {!isOver && (
              <IconButton
                icon={Icons.editFilled}
                onPress={handleEdit.bind(null, activity.id!)}
                color={GlobalStyles.colors.edit}
                containerStyle={listElementStyles.button}
              />
            )}
            <IconButton
              icon={Icons.remove}
              onPress={handleDelete.bind(null, activity.id!)}
              color={GlobalStyles.colors.error200}
              containerStyle={listElementStyles.button}
            />
          </View>
        </View>
        {isOpened && (
          <View style={listElementStyles.additionalContainer}>
            <Text style={listElementStyles.description}>
              {activity.description}
            </Text>
            {activity.place && (
              <View style={listElementStyles.row}>
                <View style={listElementStyles.rowElement}>
                  <Text style={listElementStyles.subtitle}>Place: </Text>
                  <Text
                    style={listElementStyles.description}
                    ellipsizeMode='tail'
                    numberOfLines={1}
                  >
                    {activity.place}
                  </Text>
                </View>
                <View style={listElementStyles.rowElement}>
                  <Text style={listElementStyles.subtitle}>Costs: </Text>
                  <Text
                    style={listElementStyles.description}
                    ellipsizeMode='tail'
                    numberOfLines={1}
                  >
                    {formatAmount(activity.costs)}
                  </Text>
                </View>
              </View>
            )}
            <View style={listElementStyles.row}>
              <View style={listElementStyles.rowElement}>
                <Text style={listElementStyles.subtitle}>Booked: </Text>
                <Text style={listElementStyles.description}>
                  {activity.booked ? 'Yes' : 'No'}
                </Text>
              </View>
              {activity.link && (
                <View style={listElementStyles.rowElement}>
                  <Text style={listElementStyles.subtitle}>Link: </Text>
                  <Link
                    link={activity.link}
                    color={GlobalStyles.colors.visited}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const listElementStyles = StyleSheet.create({
  container: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginVertical: 5,
    backgroundColor: GlobalStyles.colors.gray500,
    borderRadius: 16,
  },
  name: {
    color: GlobalStyles.colors.gray50,
    fontSize: 16,
    maxWidth: '65%',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 8,
  },
  rowElement: {
    maxWidth: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: 4,
  },
  button: {
    marginHorizontal: 0,
    paddingHorizontal: 4,
  },
  additionalContainer: {
    marginHorizontal: 8,
    paddingBottom: 8,
  },
  subtitle: {
    marginRight: 2,
    color: GlobalStyles.colors.gray200,
    fontWeight: 'bold',
  },
  description: {
    marginVertical: 2,
    color: GlobalStyles.colors.gray200,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

interface ActivityElementProps {
  minorStage: MinorStage;
  handleAdd: () => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const ActivityElement: React.FC<ActivityElementProps> = ({
  minorStage,
  handleAdd,
  handleEdit,
  handleDelete,
}) => {
  const screenHeight = Dimensions.get('window').height;
  const isOver = parseDate(minorStage.scheduled_end_time) < new Date();

  return (
    <View style={styles.container}>
      {minorStage.activities!.length === 0 ? (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>No activities found.</Text>
        </View>
      ) : (
        <ScrollView style={{ maxHeight: screenHeight / 3 }}>
          {minorStage.activities!.map((activity) => (
            <ActivityListElement
              activity={activity}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              key={generateRandomString()}
              isOver={isOver}
            />
          ))}
        </ScrollView>
      )}
      <View style={styles.buttonContainer}>
        {!isOver && (
          <Button
            onPress={handleAdd}
            colorScheme={ColorScheme.complementary}
            mode={ButtonMode.flat}
          >
            Add Activity
          </Button>
        )}
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
