import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

import type { Timestep } from '../TimeIntervalButtonGroup/TimeIntervalButtonGroup';

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

export default PriceChartProvider;
