import { BlurView } from 'expo-blur';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ListItem from '../UI/search/ListItem';
import { generateRandomString } from '../../utils';
import Button from '../UI/Button';
import { ButtonMode, ColorScheme, TransportationType } from '../../models';
import Input from '../UI/form/Input';
import { GlobalStyles } from '../../constants/styles';

interface TransportTypeSelectorProps {
  onChangeCountry: (countryName: string) => void;
  invalid: boolean;
  defaultType: string;
  errors: string[];
}

const TransportTypeSelector: React.FC<TransportTypeSelectorProps> = ({
  onChangeCountry,
  invalid,
  defaultType,
  errors,
}): ReactElement => {
  const [isInvalid, setIsInvalid] = useState<boolean>(invalid);
  const [openSelection, setOpenSelection] = useState(false);
  const [transportType, setTransportType] = useState<string>('');

  // useEffect(() => {
  //   setCountryName(defaultCountryName);
  // }, [defaultCountryName]);

  function handleOpenModal() {
    setOpenSelection(true);
  }

  function handleCloseModal() {
    setOpenSelection(false);
    Keyboard.dismiss();
  }

  function handlePressListElement(item: string) {
    // const prevCountry = countryName;

    // setChosenCountries((prevValues) => {
    //   const reducedCountries = prevValues.filter(
    //     (element) => element !== prevCountry
    //   );
    //   return [...reducedCountries, item];
    // });

    // setCountryName(item);
    setOpenSelection(false);
  }

  return (
    <>
      {openSelection && (
        <BlurView style={styles.blurView} intensity={100} tint='dark'>
          <View style={styles.listContainer}>
            <ScrollView style={styles.list}>
              {/* {TransportationType.map((item: string) => (
                <ListItem
                  key={generateRandomString()}
                  onPress={handlePressListElement.bind(item)}
                >
                  {item}
                </ListItem>
              ))} */}
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
        </BlurView>
      )}
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Pressable onPress={handleOpenModal}>
            <Input
              label='Transporttype'
              errors={errors}
              mandatory
              textInputConfig={{
                value: transportType,
                readOnly: true,
                placeholder: 'Pick Type',
              }}
            />
          </Pressable>
        </View>
        {isInvalid && (
          <View>
            <Text style={styles.errorText}>Please select a Transporttype</Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  outside: {
    flex: 1,
    height: '100%',
  },
  container: {
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
  blurView: {
    // TODO: Rework this , so it works for alle devices
    marginHorizontal: -36,
    marginVertical: -600,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    overflow: 'hidden',
    zIndex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  listContainer: {
    marginVertical: 'auto',
    marginHorizontal: 'auto',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 25,
    minWidth: '60%',
    maxHeight: 300,
    backgroundColor: GlobalStyles.colors.gray700,
    borderRadius: 20,
  },
  list: {
    paddingHorizontal: 5,
    borderColor: GlobalStyles.colors.gray200,
    borderWidth: 0.5,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  separatorText: {
    color: GlobalStyles.colors.gray100,
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  chosenListElement: {
    backgroundColor: GlobalStyles.colors.gray300,
    borderWidth: 0,
  },
  chosenText: {
    color: GlobalStyles.colors.gray700,
  },
  button: {
    marginHorizontal: 'auto',
  },
});

export default TransportTypeSelector;
