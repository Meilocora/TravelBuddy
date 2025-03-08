import { createContext, useState } from 'react';

import { CustomCountry } from '../models';
import { fetchCustomCountries } from '../utils/http/custom_country';

interface CustomCountryContextType {
  customCountries: CustomCountry[];
  setCustomCountries: (customCountries: CustomCountry[]) => void;
  addCustomCountry: (customCountry: CustomCountry) => void;
  deleteCustomCountry: (customCountryId: number) => void;
  updateCustomCountry: (customCountry: CustomCountry) => void;
  refetchCustomCountries: () => Promise<void>;
}

export const CustomCountryContext = createContext<CustomCountryContextType>({
  customCountries: [],
  setCustomCountries: () => {},
  addCustomCountry: () => {},
  deleteCustomCountry: () => {},
  updateCustomCountry: () => {},
  refetchCustomCountries: async () => {},
});

export default function CustomCountryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [customCountries, setCustomCountries] = useState<CustomCountry[]>([]);

  function addCustomCountry(customCountry: CustomCountry) {
    setCustomCountries((prevCustomCountries) => [
      ...prevCustomCountries,
      customCountry,
    ]);
  }

  function deleteCustomCountry(customCountryId: number) {
    setCustomCountries((prevCustomCountries) =>
      prevCustomCountries.filter(
        (customCountry) => customCountry.id !== customCountryId
      )
    );
  }

  function updateCustomCountry(updatedCustomCountry: CustomCountry) {
    setCustomCountries((prevCustomCountries) =>
      prevCustomCountries.map((customCountry) =>
        customCountry.id === updatedCustomCountry.id
          ? updatedCustomCountry
          : customCountry
      )
    );
  }

  async function refetchCustomCountries(): Promise<void> {
    const response = await fetchCustomCountries();
    if (response.data) {
      setCustomCountries(response.data);
    }
  }

  const value = {
    customCountries,
    setCustomCountries,
    addCustomCountry,
    deleteCustomCountry,
    updateCustomCountry,
    refetchCustomCountries,
  };

  return (
    <CustomCountryContext.Provider value={value}>
      {children}
    </CustomCountryContext.Provider>
  );
}
