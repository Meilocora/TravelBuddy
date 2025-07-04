import React, { ReactElement, useState } from 'react';
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
import { ButtonMode, ColorScheme } from '../../models';
import { GlobalStyles } from '../../constants/styles';

interface MapTypeSelectorProps {
  onChangeMapType: (mapType: string) => void;
  value: string;
  mapScopeList: string[];
}

const MapTypeSelector: React.FC<MapTypeSelectorProps> = ({
  onChangeMapType,
  value,
  mapScopeList,
}): ReactElement => {
  const [openSelection, setOpenSelection] = useState(false);
  const mapScopeChoice = mapScopeList.filter((item) => item !== value);

  function handleOpenModal() {
    setOpenSelection(true);
  }

  function handleCloseModal() {
    setOpenSelection(false);
    Keyboard.dismiss();
  }

  function handlePressListElement(item: string) {
    setOpenSelection(false);
    onChangeMapType(item);
  }

  function handlePressOutside() {
    setOpenSelection(false);
  }

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.row}>
            <Text style={styles.subtitle}>Scope:</Text>
            <Pressable onPress={handleOpenModal} style={styles.headerContainer}>
              <Text style={styles.header} numberOfLines={1}>
                {value}
              </Text>
            </Pressable>
          </View>
          {openSelection && mapScopeChoice.length > 0 && (
            <OutsidePressHandler onOutsidePress={handlePressOutside}>
              <View style={styles.listContainer}>
                <ScrollView style={styles.list}>
                  {mapScopeChoice.map((item: string) => (
                    <ListItem
                      key={generateRandomString()}
                      onPress={handlePressListElement.bind(item)}
                      textStyles={styles.listItemText}
                      containerStyles={styles.listItemContainer}
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
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: '7%',
  },
  container: {
    zIndex: 2,
    flexDirection: 'row',
  },
  innerContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: 250,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    textAlign: 'left',
  },
  headerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  header: {
    textAlign: 'left',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: GlobalStyles.colors.error200,
    fontStyle: 'italic',
  },
  listContainer: {
    marginTop: 5,
    backgroundColor: 'rgba(55, 55, 55, 0.8)',
    borderColor: GlobalStyles.colors.gray500,
    borderWidth: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    maxWidth: 150,
    maxHeight: 200,
  },
  list: {
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.colors.gray500,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  listItemContainer: {
    backgroundColor: GlobalStyles.colors.gray500,
    marginVertical: 3,
  },
  listItemText: {
    fontSize: 16,
    color: GlobalStyles.colors.gray50,
  },
  button: {
    marginHorizontal: 'auto',
    color: GlobalStyles.colors.gray500,
  },
});

export default MapTypeSelector;
