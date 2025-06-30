import { ReactElement, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
} from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import IconButton from '../UI/IconButton';
import { ButtonMode, ColorScheme, Icons, Location } from '../../models';
import OutsidePressHandler from 'react-native-outside-press';
import Button from '../UI/Button';
import { generateRandomString } from '../../utils';
import ListItem from '../UI/search/ListItem';

interface RoutePlannerListProps {
  locations: Location[];
  routeElements: string[];
  onAddElement: (loc: string) => void;
  onRemoveElement: (loc: string) => void;
  onSwitchElements?: (loc1: string, loc2: string) => void;
}

const RoutePlannerList: React.FC<RoutePlannerListProps> = ({
  locations,
  routeElements,
  onAddElement,
  onRemoveElement,
  onSwitchElements,
}): ReactElement => {
  const [showModal, setShowModal] = useState(false);
  const origin = routeElements[0];
  const destination = routeElements[routeElements.length - 1];
  const choosableLocations = locations
    .map((loc) => loc.data.name)
    .filter((name) => !routeElements.includes(name));

  function handlePressElement() {
    setShowModal(true);
    // TODO: Open Selection, that lets the user choose a location, that has not been added yet
  }

  return (
    <>
      {showModal && (
        // <OutsidePressHandler
        //   onOutsidePress={() => console.log('Pressed Outside')}
        //   style={styles.selectionContainer}
        // >
        // <Modal visible={showModal}>
        <View style={styles.selectionContainer}>
          <View style={styles.listContainer}>
            <ScrollView style={styles.list}>
              {choosableLocations.map((name: string) => (
                <ListItem
                  key={generateRandomString()}
                  onPress={() => onAddElement(name)}
                >
                  {name}
                </ListItem>
              ))}
            </ScrollView>
            <Button
              colorScheme={ColorScheme.neutral}
              mode={ButtonMode.flat}
              onPress={() => setShowModal(false)}
              style={styles.button}
            >
              Dismiss
            </Button>
          </View>
        </View>
        // </Modal>
        // </OutsidePressHandler>
      )}
      <View>
        <Pressable style={styles.container} onPress={handlePressElement}>
          <Text style={styles.subtitle}>Origin</Text>
          <Text style={styles.name}>{origin}</Text>
        </Pressable>
        <View style={styles.seperator}></View>
        <IconButton
          icon={Icons.add}
          onPress={() => {}}
          color={GlobalStyles.colors.gray500}
          style={styles.icon}
          size={30}
        />
        <View style={styles.seperator}></View>
        <Pressable style={styles.container} onPress={handlePressElement}>
          <Text style={styles.subtitle}>Destination</Text>
          <Text style={styles.name}>{destination}</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: 10,
  },
  selectionContainer: {
    position: 'absolute',
    height: 500,
    maxHeight: 200,
    zIndex: 1,
    backgroundColor: 'red',
  },
  listContainer: {
    marginHorizontal: 10,
    paddingTop: 10,
    backgroundColor: GlobalStyles.colors.gray700,
    borderColor: GlobalStyles.colors.gray100,
    borderWidth: 1,
    borderRadius: 20,
    zIndex: 1,
  },
  list: {
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.colors.gray100,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  button: {
    marginHorizontal: 'auto',
  },
  subtitle: {
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 200,
  },
  seperator: {
    width: '50%',
    height: 25,
    alignSelf: 'flex-start',
    borderRightWidth: 2,
    borderColor: GlobalStyles.colors.gray500,
  },
  icon: {
    justifyContent: 'center',
    marginHorizontal: 'auto',
  },
});

export default RoutePlannerList;
