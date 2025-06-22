import { ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, ViewStyle } from 'react-native';

import { StagesContext } from '../../../../store/stages-context';
import { CurrencyInfo } from '../../../../models';
import { fetchCurrencies } from '../../../../utils/http/spending';
import { formatAmount } from '../../../../utils';
import Input from '../Input';
import { GlobalStyles } from '../../../../constants/styles';
import CurrenciesModal from './CurrenciesModal';

interface CurrencyPickerProps {
  unconvertedValue: string;
  style: ViewStyle;
  inputChangedHandler: (inputIdentifier: string, enteredValue: number) => void;
}

const CurrencyPicker: React.FC<CurrencyPickerProps> = ({
  unconvertedValue,
  style,
  inputChangedHandler,
}): ReactElement => {
  const [error, setError] = useState<string>();
  const [placeHolder, setPlaceHolder] = useState('');

  // TODO: This comes from userContext
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>();

  // TODO: Delete after switch
  const stagesCtx = useContext(StagesContext);

  // TODO: Get this from userContext
  const localCurrency: CurrencyInfo = {
    currency: stagesCtx.localCurrency!,
    conversionRate: stagesCtx.conversionRate!,
  };

  const [chosenCurrency, setChosenCurrency] =
    useState<CurrencyInfo>(localCurrency);
  const [showModal, setShowModal] = useState(false);

  // TODO: This is already outsourced to user-context
  function sortCurrencies(currencies: CurrencyInfo[]) {
    // Get standard currencies first
    const eur = currencies.filter((c) => c.currency === 'EUR')[0];
    const usd = currencies.filter((c) => c.currency === 'USD')[0];
    // Remove duplicates for localCurrency, EUR, USD
    const filtered = currencies.filter(
      (c) =>
        c.currency !== localCurrency.currency &&
        c.currency !== 'EUR' &&
        c.currency !== 'USD'
    );

    // Sort the rest alphabetically by currency
    filtered.sort((a, b) => a.currency!.localeCompare(b.currency!));

    // Build the final list
    const sorted = [
      localCurrency,
      localCurrency.currency !== 'EUR' ? eur : undefined,
      localCurrency.currency !== 'USD' ? usd : undefined,
      ...filtered,
    ].filter((c): c is CurrencyInfo => c?.currency !== undefined);

    setCurrencies(sorted);
  }

  useEffect(() => {
    async function getCurrencies() {
      const response = await fetchCurrencies();
      if (response.error) {
        setError(response.error);
      } else if (response.currencies) {
        sortCurrencies(response.currencies);
        calculateConvertedAmount();
      }
    }

    getCurrencies();
  }, []);

  function selectCurrency(currency: CurrencyInfo) {
    setChosenCurrency(currency);
    setShowModal(false);
    calculateConvertedAmount(currency.conversionRate);
  }

  function calculateConvertedAmount(conversionRate?: number) {
    // Optional input, so the converted amount is instantly recalculated, when the user changes the Currency
    let convertedValue = 0;
    if (conversionRate) {
      convertedValue = parseFloat(unconvertedValue) / conversionRate;
    } else {
      convertedValue =
        parseFloat(unconvertedValue) / chosenCurrency.conversionRate;
    }

    if (unconvertedValue.includes(',')) {
      setPlaceHolder('NaN');
      inputChangedHandler('amount', 0);
      return;
    } else if (
      parseFloat(unconvertedValue) === 0 ||
      parseFloat(unconvertedValue).toString() === 'NaN'
    ) {
      inputChangedHandler('amount', 0);
      setPlaceHolder(`0,00 €`);
      return;
    }

    if (convertedValue > 999) {
      setPlaceHolder(
        formatAmount(parseFloat(convertedValue.toFixed(0))).toString()
      );
    } else {
      setPlaceHolder(`${convertedValue.toFixed(2).toString()} €`);
    }

    inputChangedHandler('amount', parseFloat(convertedValue.toFixed(2)));
  }

  return (
    <>
      {showModal && currencies && (
        <CurrenciesModal
          currencies={currencies}
          onCloseModal={() => setShowModal(false)}
          onSelectCurrency={selectCurrency}
        />
      )}
      <View style={[styles.container, style]}>
        <View style={styles.currencySymbol}>
          <Pressable
            onPress={() => setShowModal(true)}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={styles.currencyText}>{chosenCurrency.currency}</Text>
          </Pressable>
        </View>
        {chosenCurrency.currency !== 'EUR' && placeHolder !== '' && (
          <Input
            label=''
            invalid={false}
            errors={[]}
            textInputConfig={{
              readOnly: true,
              placeholder: placeHolder,
            }}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  currencySymbol: {
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 32,
    backgroundColor: GlobalStyles.colors.gray700,
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.5,
  },
  currencyText: {
    fontSize: 22,
    color: GlobalStyles.colors.gray100,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});

export default CurrencyPicker;
