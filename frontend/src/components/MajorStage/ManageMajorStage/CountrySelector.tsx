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

import { GlobalStyles } from '../../../constants/styles';
import { ButtonMode, ColorScheme } from '../../../models';
import { fetchJourneysCustomCountries } from '../../../utils/http/custom_country';
import ListItem from '../../UI/search/ListItem';
import Input from '../../UI/form/Input';
import { generateRandomString } from '../../../utils';
import Button from '../../UI/Button';
import { BlurView } from 'expo-blur';
import { JourneyContext } from '../../../store/journey-context';
import { MajorStageContext } from '../../../store/majorStage-context.';

interface CountrySelectorProps {
  onChangeCountry: (countryName: string) => void;
  invalid: boolean;
  journeyId: number;
  defaultCountryName: string;
  errors: string[];
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  onChangeCountry,
  invalid,
  journeyId,
  defaultCountryName,
  errors,
}): ReactElement => {
  const [isInvalid, setIsInvalid] = useState<boolean>(invalid);
  const [openSelection, setOpenSelection] = useState(false);
  const [countryName, setCountryName] = useState<string>('');
  const [fetchedData, setFetchedData] = useState<string[]>([]);
  const [chosenCountries, setChosenCountries] = useState<string[]>([]);

  const journeyCtx = useContext(JourneyContext);
  const majorStageCtx = useContext(MajorStageContext);

  const journey = journeyCtx.journeys.find(
    (journey) => journey.id === journeyId
  );

  useEffect(() => {
    setCountryName(defaultCountryName);
  }, [defaultCountryName]);

  console.log(countryName);

  function handleOpenModal() {
    setOpenSelection(true);
  }

  function handleCloseModal() {
    setOpenSelection(false);
    Keyboard.dismiss();
  }

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      const { data } = await fetchJourneysCustomCountries(journeyId);
      if (data) {
        let names = data.map((item) => item.name);

        let countriesList: string[] = [];
        journey!.majorStagesIds!.forEach((id) => {
          countriesList.push(
            majorStageCtx.majorStages.find((majorStage) => majorStage.id === id)
              ?.country!
          );
        });
        setChosenCountries(countriesList);

        if (countriesList) {
          names = names.filter((item) => !countriesList.includes(item));
        }

        LayoutAnimation.linear();
        setFetchedData(names);
      }
    }

    fetchData();
  }, [journeyId]);

  function handlePressListElement(item: string) {
    const prevCountry = countryName;

    setChosenCountries((prevValues) => {
      const reducedCountries = prevValues.filter(
        (element) => element !== prevCountry
      );
      return [...reducedCountries, item];
    });

    setFetchedData((prevValues) => {
      const reducedCountries = prevValues.filter((element) => element !== item);
      if (prevCountry) {
        return [...reducedCountries, prevCountry];
      } else {
        return [...reducedCountries];
      }
    });

    setCountryName(item);
    onChangeCountry(item);
    setOpenSelection(false);
  }

  return (
    <>
      {openSelection && (
        <BlurView style={styles.blurView} intensity={100} tint='dark'>
          <View style={styles.listContainer}>
            <ScrollView style={styles.list}>
              {fetchedData.length > 0 &&
                fetchedData.map((item) => (
                  <ListItem
                    key={generateRandomString()}
                    onPress={handlePressListElement.bind(item)}
                  >
                    {item}
                  </ListItem>
                ))}
              {chosenCountries.length > 0 && (
                <View>
                  <Text style={styles.separatorText}>Journeys countries</Text>
                  {chosenCountries.map((item) => (
                    <ListItem
                      key={generateRandomString()}
                      onPress={handlePressListElement.bind(item)}
                      containerStyles={styles.chosenListElement}
                      textStyles={styles.chosenText}
                    >
                      {item}
                    </ListItem>
                  ))}
                </View>
              )}
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
              label='Country'
              errors={errors}
              mandatory
              textInputConfig={{
                value: countryName,
                readOnly: true,
                placeholder: 'Pick Country',
              }}
            />
          </Pressable>
        </View>
        {isInvalid && (
          <View>
            <Text style={styles.errorText}>Please select a country</Text>
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

export default CountrySelector;
