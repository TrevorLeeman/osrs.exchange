import React, { createContext, ReactNode, useState } from 'react';
import type { Timestep } from '../TimeIntervalButtonGroup/TimeIntervalButtonGroup';

interface PriceChartContextType {
  timestep: Timestep;
  setTimestep: React.Dispatch<React.SetStateAction<Timestep>>;
}

const initialValues: PriceChartContextType = { timestep: '5m', setTimestep: () => {} };

export const PriceChartContext = createContext<PriceChartContextType>(initialValues);

const PriceChartProvider = ({ children }: { children: React.ReactNode }) => {
  const [timestep, setTimestep] = useState<Timestep>(initialValues.timestep);

  return (
    <PriceChartContext.Provider
      value={{
        timestep,
        setTimestep,
      }}
    >
      {children}
    </PriceChartContext.Provider>
  );
};

export default PriceChartProvider;
