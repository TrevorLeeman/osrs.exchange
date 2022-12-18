import { useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import fromUnixTime from 'date-fns/fromUnixTime';
import subHours from 'date-fns/subHours';
import { useSessionStorage } from 'usehooks-ts';

import { CHART_THEME, LINE_LABELS, PriceChartContext, priceChartInitialValues } from '../../hooks/usePriceChartContext';
import { realTimeRefetchInterval } from '../../util/calculations';
import {
  ITEM_PAGE_QUERIES,
  LongTermPrices,
  RealTimePrices,
  fetchLongTermPrices,
  fetchRealTimePrices,
} from '../../util/queries';
import type { Timestep } from './TimeIntervalOptions';

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

export const PriceChartProvider = ({ id, children }: PriceChartProviderProps) => {
  const [timestep, setTimestep] = useSessionStorage<Timestep>('timestep', priceChartInitialValues.timestep);
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
  } = useQuery<LongTermPrices>([ITEM_PAGE_QUERIES.longTermPrices, { id }], fetchLongTermPrices, {
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
