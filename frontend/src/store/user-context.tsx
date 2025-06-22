import { createContext, useState } from 'react';
import { LatLng } from 'react-native-maps';

import { CurrencyInfo } from '../models';
import { fetchCurrencies } from '../utils/http/spending';

interface UserContextType {
  currentPosition: LatLng;
  timezoneoffset: number;
  localCurrency: CurrencyInfo;
  currencies: CurrencyInfo[];
  fetchUserData: () => Promise<void | string>;
}

export const UserContext = createContext<UserContextType>({
  currentPosition: { latitude: 0, longitude: 0 },
  timezoneoffset: 0,
  localCurrency: { currency: 'EUR', conversionRate: 1 },
  currencies: [],
  fetchUserData: async () => {},
});

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentPosition, setCurrentPosition] = useState<LatLng>({
    latitude: 0,
    longitude: 0,
  });
  const [timezoneoffset, setTimezoneOffset] = useState<number>(0);
  const [localCurrency, setLocalCurrency] = useState<CurrencyInfo>({
    currency: 'EUR',
    conversionRate: 1,
  });
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>([]);

  async function fetchUserData(): Promise<void | string> {
    // FetchCurrentPosition first

    const response = await fetchCurrencies();
    if (response.error) {
      return response.error;
    } else if (response.currencies) {
      sortCurrencies(response.currencies);
    }
  }

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

  const value = {
    currentPosition,
    timezoneoffset,
    localCurrency,
    currencies,
    fetchUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
