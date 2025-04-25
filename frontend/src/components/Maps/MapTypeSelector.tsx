import React, { ReactElement, useEffect, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import OutsidePressHandler from 'react-native-outside-press';

import ListItem from '../UI/search/ListItem';
import { generateRandomString } from '../../utils';
import Button from '../UI/Button';
import { ButtonMode, ColorScheme, TransportationType } from '../../models';
import Input from '../UI/form/Input';
import { GlobalStyles } from '../../constants/styles';

interface MapTypeSelectorProps {
  onChangeMapType: (mapType: string) => void;
  defaultType: string;
}

const MapTypeSelector: React.FC<MapTypeSelectorProps> = ({
  onChangeMapType,
  defaultType,
}): ReactElement => {
  const [openSelection, setOpenSelection] = useState(false);
  const [transportType, setTransportType] = useState<string>('');

  useEffect(() => {
    setTransportType(defaultType);
  }, [defaultType]);

  function handleOpenModal() {
    setOpenSelection(true);
  }

  function handleCloseModal() {
    setOpenSelection(false);
    Keyboard.dismiss();
  }

  function handlePressListElement(item: string) {
    setTransportType(item);
    setOpenSelection(false);
    onChangeMapType(item);
  }

  function handlePressOutside() {
    setOpenSelection(false);
  }

  return (
    <View style={styles.root}>
      {openSelection && (
        <OutsidePressHandler
          onOutsidePress={handlePressOutside}
          style={styles.selectionContainer}
        >
          <View style={styles.listContainer}>
            <ScrollView style={styles.list}>
              {Object.values(TransportationType).map((item: string) => (
                <ListItem
                  key={generateRandomString()}
                  onPress={handlePressListElement.bind(item)}
                  containerStyles={
                    item === transportType ? styles.chosenType : {}
                  }
                  textStyles={item === transportType ? styles.chosenText : {}}
                >
                  {item}
                </ListItem>
              ))}
            </ScrollView>
            <Button
              colorScheme={ColorScheme.neutral}
              mode={ButtonMode.flat}
              onPress={handleCloseModal}
              style={styles.button}
            >
              Dismiss
            </Button>
          </View>
        </OutsidePressHandler>
      )}
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Pressable onPress={handleOpenModal}>
            <Text>{transportType}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  outerContainer: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    zIndex: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '50%',
  },
  headerContainer: {
    width: '100%',
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    color: GlobalStyles.colors.gray50,
  },
  errorText: {
    fontSize: 16,
    color: GlobalStyles.colors.error200,
    fontStyle: 'italic',
  },
  selectionContainer: {
    position: 'absolute',
    top: '100%',
    width: '50%',
    maxHeight: 200,
    zIndex: 1,
  },
  listContainer: {
    marginHorizontal: 10,
    backgroundColor: GlobalStyles.colors.gray700,
    borderColor: GlobalStyles.colors.gray100,
    borderWidth: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 1,
  },
  list: {
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.colors.gray100,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  chosenType: {
    backgroundColor: GlobalStyles.colors.accent200,
  },
  chosenText: {
    color: GlobalStyles.colors.gray50,
    fontWeight: 'bold',
  },
  button: {
    marginHorizontal: 'auto',
  },
});

export default MapTypeSelector;
