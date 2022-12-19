import { Dispatch, SetStateAction, createContext, useContext } from 'react';

import { Timestep } from '../components/PriceChart/TimeIntervalOptions';
import { COLUMN_HEADERS } from '../util/item-table-presets';

type PriceChartContextType = {
  realTimeInstaBuyPrices: number[] | undefined;
  realTimeInstaSellPrices: number[] | undefined;
  averageLongTermPrices: number[] | undefined;
  timestep: Timestep;
  setTimestep: Dispatch<SetStateAction<Timestep>>;
  longTermPricesEnabled: boolean;
  setLongTermPricesEnabled: Dispatch<SetStateAction<boolean>>;
  xAxisLabels: Date[] | undefined;
  lineLabels: typeof LINE_LABELS;
  theme: typeof CHART_THEME;
};

export const LINE_LABELS = {
  instabuy: COLUMN_HEADERS.instaBuyPrice,
  instasell: COLUMN_HEADERS.instaSellPrice,
  average: 'Average Price',
};

export const CHART_THEME = {
  colors: {
    buy: {
      light: '#90ed99',
      dark: '#30a339',
      border: '#38c744',
    },
    sell: {
      light: '#a21144',
      dark: '#F881AB',
      border: '#F4256D',
    },
    longterm: {
      border: '#1e779c',
    },
    crosshair: {
      border: '#F4256D',
    },
    gridLines: {
      light: '#D7DBDF',
      dark: '#3A3F42',
    },
  },
};

export const priceChartInitialValues: PriceChartContextType = {
  realTimeInstaBuyPrices: [],
  realTimeInstaSellPrices: [],
  averageLongTermPrices: [],
  timestep: '5m',
  setTimestep: () => {},
  longTermPricesEnabled: false,
  setLongTermPricesEnabled: () => {},
  xAxisLabels: [],
  lineLabels: LINE_LABELS,
  theme: CHART_THEME,
};

export const PriceChartContext = createContext<PriceChartContextType>(priceChartInitialValues);

export const usePriceChartContext = () => {
  const context = useContext(PriceChartContext);

  if (context === priceChartInitialValues) {
    throw new Error('usePriceChartContext must be used within a PriceChartProvider');
  }

  return context;
};
