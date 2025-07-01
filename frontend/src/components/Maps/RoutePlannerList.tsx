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
import RoutePlannerListElement from './RoutePlannerListElement';

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
  let destination = '';
  if (routeElements.length > 1) {
    destination = routeElements[routeElements.length - 1];
  }
  const choosableLocations = locations
    .map((loc) => loc.data.name)
    .filter((name) => !routeElements.includes(name));

  function handlePressElement() {
    setShowModal(true);
    // TODO: Open Selection, that lets the user choose a location, that has not been added yet
  }

  function handleAddElement(name: string) {
    onAddElement(name);
    setShowModal(false);
  }

  return (
    <>
      {showModal && (
        <Modal
          visible={showModal}
          transparent
          animationType='fade'
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.listContainer}>
              <ScrollView style={styles.list}>
                {choosableLocations.map((name: string) => (
                  <ListItem
                    key={generateRandomString()}
                    onPress={() => handleAddElement(name)}
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
        </Modal>
      )}
      <View>
        <RoutePlannerListElement
          name={origin}
          subtitle={'Origin'}
          onPress={handlePressElement}
        />
        <View style={styles.seperator}></View>
        {routeElements.length > 2 &&
          routeElements.slice(1, -1).map((name) => (
            <>
              <RoutePlannerListElement
                key={generateRandomString()}
                name={name}
                onPress={handlePressElement}
              />
              <View style={styles.seperator}></View>
            </>
          ))}
        <RoutePlannerListElement
          name={destination}
          subtitle={'Destination'}
          onPress={handlePressElement}
        />
        <Button
          onPress={() => setShowModal(true)}
          colorScheme={ColorScheme.neutral}
          style={styles.icon}
        >
          Add Stopover
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    maxHeight: '70%',
    width: '80%',
    alignItems: 'center',
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
  seperator: {
    width: '50%',
    height: 12,
    alignSelf: 'flex-start',
    borderRightWidth: 2,
    borderColor: GlobalStyles.colors.gray500,
  },
  iconContainer: {
    marginVertical: 4,
    paddingVertical: 0,
  },
  icon: {
    justifyContent: 'center',
    marginHorizontal: 'auto',
  },
});

export default RoutePlannerList;
