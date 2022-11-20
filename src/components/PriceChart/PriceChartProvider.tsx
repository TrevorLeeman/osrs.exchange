import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

import type { Timestep } from './TimeIntervalOptions';

interface PriceChartContextType {
  timestep: Timestep;
  setTimestep: Dispatch<SetStateAction<Timestep>>;
  longTermPricesEnabled: boolean;
  setLongTermPricesEnabled: Dispatch<SetStateAction<boolean>>;
}

const initialValues: PriceChartContextType = {
  timestep: '5m',
  setTimestep: () => {},
  longTermPricesEnabled: false,
  setLongTermPricesEnabled: () => {},
};

export const PriceChartContext = createContext<PriceChartContextType>(initialValues);

const PriceChartProvider = ({ children }: { children: ReactNode }) => {
  const [timestep, setTimestep] = useState<Timestep>(initialValues.timestep);
  const [longTermPricesEnabled, setLongTermPricesEnabled] = useState(initialValues.longTermPricesEnabled);

  return (
    <PriceChartContext.Provider
      value={{
        timestep,
        setTimestep,
        longTermPricesEnabled,
        setLongTermPricesEnabled,
      }}
    >
      {children}
    </PriceChartContext.Provider>
  );
};

export const usePriceChartContext = () => {
  const context = useContext(PriceChartContext);

  if (context === initialValues) {
    throw new Error('usePriceChartContext must be used within a PriceChartProvider');
  }

  return context;
};

export default PriceChartProvider;
