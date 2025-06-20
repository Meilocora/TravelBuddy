import { ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { StagesContext } from '../../../store/stages-context';
import { CurrencyInfo } from '../../../models';
import { fetchCurrencies } from '../../../utils/http/spending';

interface CurrencyPickerProps {}

const CurrencyPicker: React.FC<CurrencyPickerProps> = ({}): ReactElement => {
  const [error, setError] = useState<string>();
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>();

  const stagesCtx = useContext(StagesContext);
  const localCurrency: CurrencyInfo = {
    currency: stagesCtx.localCurrency!,
    conversionRate: stagesCtx.conversionRate!,
  };

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
    filtered.sort((a, b) => a.currency.localeCompare(b.currency));

    // Build the final list
    const sorted = [
      localCurrency,
      localCurrency.currency !== 'EUR' ? eur : undefined,
      localCurrency.currency !== 'USD' ? usd : undefined,
      ...filtered,
    ].filter((c) => c !== undefined);

    setCurrencies(sorted);
  }

  useEffect(() => {
    async function getCurrencies() {
      const response = await fetchCurrencies();
      if (response.error) {
        setError(response.error);
      } else if (response.currencies) {
        sortCurrencies(response.currencies);
      }
    }

    getCurrencies();
  }, []);

  // TODO: Build a modal, that shows a list of currencies to pick from
  // TODO: localCurrency should always be pre selected

  return <View></View>;
};

const styles = StyleSheet.create({});

export default CurrencyPicker;
