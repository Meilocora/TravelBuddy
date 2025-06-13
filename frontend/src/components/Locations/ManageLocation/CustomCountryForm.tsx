import React, { ReactElement, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import {
  ColorScheme,
  CustomCountry,
  CustomCountryFormValues,
  Icons,
} from '../../../models';
import Input from '../../UI/form/Input';
import { getLanguageNames } from '../../../utils/languages';
import { formatQuantity } from '../../../utils';
import { GlobalStyles } from '../../../constants/styles';
import TextLink from '../../UI/TextLink';
import Button from '../../UI/Button';
import IconButton from '../../UI/IconButton';
import InfoPoint from './InfoPoint';
import {
  deleteCountry,
  DeleteCustomCountryProps,
  updateCountry,
  UpdateCustomCountryProps,
} from '../../../utils/http/custom_country';
import Modal from '../../UI/Modal';
import PlacesToggle from '../Places/PlacesToggle';

interface CustomCountryFormProps {
  country: CustomCountry;
  isEditing: boolean;
  onUpdate: (response: UpdateCustomCountryProps) => void;
  onDelete: (response: DeleteCustomCountryProps) => void;
  isShowingPlaces: boolean;
  handleTogglePlaces: () => void;
}

const CustomCountryForm: React.FC<CustomCountryFormProps> = ({
  country,
  isEditing,
  onUpdate,
  onDelete,
  isShowingPlaces,
  handleTogglePlaces,
}): ReactElement => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const languages = getLanguageNames(country.languages);
  const population = formatQuantity(country.population);

  const [inputs, setInputs] = useState<CustomCountryFormValues>({
    visum_regulations: {
      value: country?.visum_regulations || null,
      isValid: true,
      errors: [],
    },
    best_time_to_visit: {
      value: country?.best_time_to_visit || null,
      isValid: true,
      errors: [],
    },
    general_information: {
      value: country?.general_information || null,
      isValid: true,
      errors: [],
    },
  });

  let headerStyle = styles.header;
  if (country.wiki_link) {
    headerStyle = { ...headerStyle, ...styles.underlined };
  }

  function inputChangedHandler(inputIdentifier: string, enteredValue: string) {
    setInputs((currInputs) => {
      return {
        ...currInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true, errors: [] }, // dynamically use propertynames for objects
      };
    });
  }

  async function validateInputs(): Promise<void> {
    // Set all errors to empty array to prevent stacking of errors
    setIsSubmitting(true);
    for (const key in inputs) {
      inputs[key as keyof CustomCountryFormValues].errors = [];
    }

    const response = await updateCountry(inputs, country.id);

    const { error, status, customCountry, customCountryFormValues } = response!;

    if ((!error && customCountry) || error) {
      onUpdate(response);
    } else if (customCountryFormValues) {
      setInputs((prevValues) => customCountryFormValues);
    }
    setIsSubmitting(false);
    return;
  }

  async function deleteCustomCountryHandler() {
    const response = await deleteCountry(country.id);
    onDelete(response);
    setIsDeleting(false);
    return;
  }

  function deleteHandler() {
    setIsDeleting(true);
  }

  function closeModalHandler() {
    setIsDeleting(false);
  }

  let buttonLabel = 'Save';
  if (isSubmitting) {
    buttonLabel = 'Saving...';
  }

  return (
    <>
      {isDeleting && (
        <Modal
          title='Are you sure?'
          content={`If you delete ${country.name}, all related Places to visit will also be deleted permanently`}
          onConfirm={deleteCustomCountryHandler}
          onCancel={closeModalHandler}
        />
      )}
      <ScrollView style={styles.container}>
        {!country.wiki_link && (
          <Text style={styles.header}>{country.name}</Text>
        )}
        {country.wiki_link && (
          <TextLink link={country.wiki_link} textStyle={headerStyle}>
            {country.name}
          </TextLink>
        )}
        <View style={styles.formRow}>
          <InfoPoint title='Capital' value={country.capital || 'No data...'} />
          <InfoPoint title='Code' value={country.code || 'No data...'} />
        </View>
        <View style={styles.formRow}>
          <InfoPoint
            title='Currencies'
            value={country.currencies || 'No data...'}
          />
          <InfoPoint
            title='Population'
            value={population?.toString() || 'No data...'}
          />
        </View>
        <View style={styles.formRow}>
          <InfoPoint title='Region' value={country.region || 'No data...'} />
          <InfoPoint
            title='Subregion'
            value={country.subregion || 'No data...'}
          />
        </View>
        <View style={styles.formRow}>
          <InfoPoint
            title='Languages'
            value={languages?.toString() || 'No data...'}
          />
        </View>
        <View style={styles.formRow}>
          <InfoPoint
            title='Timezones'
            value={country.timezones?.toString() || 'No data...'}
          />
        </View>
        <View style={styles.formRow}>
          {!isEditing ? (
            <InfoPoint
              title='Best Time to Visit'
              value={country.best_time_to_visit || 'No data...'}
            />
          ) : (
            <Input
              label='Best Time to Visit'
              invalid={!inputs.best_time_to_visit.isValid}
              errors={inputs.best_time_to_visit.errors}
              isEditing={isEditing}
              style={styles.input}
              textInputConfig={{
                value: inputs.best_time_to_visit.value?.toString(),
                placeholder: 'Enter best time to visit here',
                onChangeText: inputChangedHandler.bind(
                  this,
                  'best_time_to_visit'
                ),
              }}
            />
          )}
        </View>
        <View style={styles.formRow}>
          {!isEditing ? (
            <InfoPoint
              title='General Information'
              value={country.general_information || 'No data...'}
            />
          ) : (
            <Input
              label='General Information'
              invalid={!inputs.general_information.isValid}
              errors={inputs.general_information.errors}
              isEditing={isEditing}
              style={styles.input}
              textInputConfig={{
                multiline: true,
                value: inputs.general_information.value?.toString(),
                placeholder: 'Enter general information here',
                onChangeText: inputChangedHandler.bind(
                  this,
                  'general_information'
                ),
              }}
            />
          )}
        </View>
        <View style={styles.formRow}>
          {!isEditing ? (
            <InfoPoint
              title='Visum Regulations'
              value={country.visum_regulations || 'No data...'}
            />
          ) : (
            <Input
              label='Visum Regulations'
              invalid={!inputs.visum_regulations.isValid}
              errors={inputs.visum_regulations.errors}
              isEditing={isEditing}
              style={styles.input}
              textInputConfig={{
                multiline: true,
                value: inputs.visum_regulations.value?.toString(),
                placeholder: 'Enter visum regulations here',
                onChangeText: inputChangedHandler.bind(
                  this,
                  'visum_regulations'
                ),
              }}
            />
          )}
        </View>
        <PlacesToggle
          isShowingPlaces={isShowingPlaces}
          handleTogglePlaces={handleTogglePlaces}
        />
        <View style={styles.buttonsContainer}>
          {!isEditing && (
            <IconButton
              icon={Icons.delete}
              onPress={deleteHandler}
              size={36}
              color={GlobalStyles.colors.error500}
            />
          )}
          {isEditing && (
            <>
              <Button
                colorScheme={ColorScheme.primary}
                onPress={validateInputs}
              >
                {buttonLabel}
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: 'rgba(169, 169, 169, 0.3)',
    borderRadius: 10,
  },
  header: {
    fontSize: 22,
    textAlign: 'center',
    color: GlobalStyles.colors.gray50,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  underlined: {
    textDecorationLine: 'underline',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '50%',
    marginVertical: 4,
    marginHorizontal: 'auto',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    marginVertical: 4,
  },
});

export default CustomCountryForm;
