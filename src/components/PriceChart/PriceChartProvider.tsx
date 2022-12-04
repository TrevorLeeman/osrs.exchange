import { Dispatch, SetStateAction, createContext, useContext, useMemo, useState } from 'react';

import { QueryFunction, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import fromUnixTime from 'date-fns/fromUnixTime';
import subHours from 'date-fns/subHours';
import { useSessionStorage } from 'usehooks-ts';

import { ITEM_PAGE_QUERIES, Price } from '../../../pages/item/[slug]';
import type { Timestep } from './TimeIntervalOptions';

type RealTimePrices = {
  data: [Price];
};

type LongTermPriceData = {
  [key: number]: LongTermPrice[];
};

type LongTermPrice = {
  id: string;
  price: number;
  volume: number | null;
  timestamp: number;
};

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

type PriceChartProviderProps = {
  id: number;
  children?: React.ReactNode;
};

const TIMESTEP_TO_HOURS = new Map<Timestep, number>([
  ['5m', 24],
  ['1h', 7 * 24],
  ['6h', 30 * 24],
  ['1y', 365 * 24],
  ['all', 99999999],
]);

const LINE_LABELS = {
  instabuy: 'Buy Price',
  instasell: 'Sell price',
  average: 'Average price',
};

const CHART_THEME = {
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

const initialValues: PriceChartContextType = {
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

export const PriceChartContext = createContext<PriceChartContextType>(initialValues);

export const PriceChartProvider = ({ id, children }: PriceChartProviderProps) => {
  const [timestep, setTimestep] = useSessionStorage<Timestep>('timestep', initialValues.timestep);
  const [longTermPricesEnabled, setLongTermPricesEnabled] = useState(timestep === '1y' || timestep === 'all');

  const {
    data: realTimePriceData,
    isLoading: realTimePricesLoading,
    isFetching: realTimePricesFetching,
  } = useQuery<RealTimePrices>([ITEM_PAGE_QUERIES.realTimePrices, { id, timestep }], fetchRealTimePrices, {
    refetchInterval: realTimeRefetchInterval(timestep),
    enabled: !longTermPricesEnabled,
  });
  const {
    data: longTermPriceData,
    isLoading: longTermPricesLoading,
    isFetching: longTermPricesFetching,
  } = useQuery<LongTermPriceData>([ITEM_PAGE_QUERIES.longTermPrices, { id }], fetchLongTermPrices, {
    enabled: longTermPricesEnabled,
  });

  const realTimePrices = useMemo(() => (realTimePriceData ? realTimePriceData?.data : null), [realTimePriceData]);
  const longTermPrices = useMemo(() => (longTermPriceData ? longTermPriceData[id] : null), [longTermPriceData]);

  const stringifiedLatestPrice = useMemo(
    () => (realTimePrices?.length ? JSON.stringify(realTimePrices[realTimePrices.length - 1]) : null),
    [realTimePrices],
  );

  const realTimePricesDateFiltered = useMemo(
    () =>
      realTimePrices?.filter(
        price => fromUnixTime(price.timestamp) > subHours(new Date(), TIMESTEP_TO_HOURS.get(timestep)!),
      ),
    [stringifiedLatestPrice],
  );
  const realTimeLabels = useMemo(
    () => realTimePricesDateFiltered?.reverse().map(priceEntry => fromUnixTime(priceEntry.timestamp)),
    [stringifiedLatestPrice],
  );
  const realTimeInstaBuyPrices = useMemo(
    () => realTimePricesDateFiltered?.map(priceEntry => priceEntry.avgHighPrice),
    [stringifiedLatestPrice],
  );
  const realTimeInstaSellPrices = useMemo(
    () => realTimePricesDateFiltered?.map(priceEntry => priceEntry.avgLowPrice),
    [stringifiedLatestPrice],
  );
  const longTermPricesDateFiltered = useMemo(
    () =>
      longTermPrices?.filter(
        price => fromUnixTime(price.timestamp / 1000) > subHours(new Date(), TIMESTEP_TO_HOURS.get(timestep)!),
      ),
    [longTermPriceData, timestep],
  );
  const longTermLabels = useMemo(
    () => longTermPricesDateFiltered?.map(priceEntry => fromUnixTime(priceEntry.timestamp / 1000)),
    [longTermPricesDateFiltered],
  );
  const averageLongTermPrices = useMemo(
    () => longTermPricesDateFiltered?.map(priceEntry => priceEntry.price),
    [longTermPricesDateFiltered],
  );

  return (
    <PriceChartContext.Provider
      value={{
        realTimeInstaBuyPrices,
        realTimeInstaSellPrices,
        averageLongTermPrices,
        timestep,
        setTimestep,
        longTermPricesEnabled,
        setLongTermPricesEnabled,
        lineLabels: LINE_LABELS,
        xAxisLabels: longTermPricesEnabled ? longTermLabels : realTimeLabels,
        theme: CHART_THEME,
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

const realTimeRefetchInterval = (timestep: Timestep) => {
  switch (timestep) {
    case '5m':
      return 30 * 1000; // 30 seconds
    case '1h':
      return 60 * 1000 * 5; // 5 min
    case '6h':
      return 60 * 1000 * 60; // 1 hour
    default:
      return 30 * 1000; // 30 seconds
  }
};

const fetchRealTimePrices: QueryFunction<RealTimePrices> = async ({ queryKey }) => {
  const [_key, { id, timestep }] = queryKey as [string, { id: number; timestep: Timestep }];
  return axios
    .get<RealTimePrices>(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=${timestep}&id=${id}`)
    .then(res => res.data);
};

const fetchLongTermPrices: QueryFunction<LongTermPriceData> = async ({ queryKey }) => {
  const [_key, { id }] = queryKey as [string, { id: number }];
  return axios
    .get<LongTermPriceData>(`https://api.weirdgloop.org/exchange/history/osrs/all?id=${id}&compress=false`)
    .then(res => res.data);
};
