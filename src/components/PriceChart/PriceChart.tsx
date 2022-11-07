import { useContext, useMemo } from 'react';

import { useTheme as useNextUiTheme } from '@nextui-org/react';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
//@ts-ignore
import { CrosshairPlugin } from 'chartjs-plugin-crosshair';
import Zoom from 'chartjs-plugin-zoom';
import { fromUnixTime, subHours } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Line } from 'react-chartjs-2';

import { ITEM_PAGE_QUERIES, Price } from '../../../pages/item/[slug]';
import { PriceChartContext } from './PriceChartProvider';
import type { Timestep } from './TimeIntervalButtonGroup';

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Zoom,
  CrosshairPlugin,
);

const TIMESTEP_TO_HOURS = new Map<Timestep, number>([
  ['5m', 24],
  ['1h', 7 * 24],
  ['6h', 30 * 24],
  ['1y', 365 * 24],
  ['all', 99999999],
]);

const LABELS = {
  instabuy: 'Instabuy',
  instasell: 'Instasell',
  average: 'Average price',
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

const PriceChart = ({ id }: { id: number }) => {
  const { isDark } = useNextUiTheme();
  const { timestep, longTermPricesEnabled } = useContext(PriceChartContext);
  const gridColor = isDark ? '#3A3F42' : '#D7DBDF';

  const {
    data: realTimePriceData,
    isLoading: realTimePricesLoading,
    isFetching: realTimePricesFetching,
  } = useQuery<RealTimePrices>([ITEM_PAGE_QUERIES.realTimePrices, { id, timestep }], fetchRealTimePrices, {
    refetchInterval: 60 * 1000,
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
    <Line
      className="max-h-[500px]"
      data={{
        labels: longTermPricesEnabled ? longTermLabels : realTimeLabels,
        datasets: [
          {
            label: LABELS.instabuy,
            backgroundColor: isDark ? '#90ed99' : '#30a339',
            pointRadius: 2,
            borderColor: '#38c744',
            data: realTimeInstaBuyPrices,
            cubicInterpolationMode: 'monotone',
            showLine: !longTermPricesEnabled,
          },
          {
            label: LABELS.instasell,
            backgroundColor: isDark ? '#F881AB' : '#a21144',
            pointRadius: 2,
            borderColor: '#F4256D',
            data: realTimeInstaSellPrices,
            cubicInterpolationMode: 'monotone',
            showLine: !longTermPricesEnabled,
          },
          {
            label: LABELS.average,
            pointRadius: 0,
            pointHoverRadius: longTermPricesEnabled ? 4 : 0,
            borderColor: '#1e779c',
            borderWidth: 2,
            data: averageLongTermPrices,
            cubicInterpolationMode: 'monotone',
            showLine: longTermPricesEnabled,
          },
        ],
      }}
      options={{
        spanGaps: true,
        scales: {
          x: {
            type: 'time',
            adapters: {
              date: {
                locale: enUS,
              },
            },
            grid: {
              color: gridColor,
            },
          },

          y: {
            type: 'linear',
            grid: {
              color: gridColor,
            },
          },
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
            },
            limits: {
              x: { min: 'original', max: 'original' },
              y: { min: 'original', max: 'original' },
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'xy',
            },
          },
          tooltip: {
            mode: 'x',
            intersect: false,
            filter: (item, index, array) => {
              if (longTermPricesEnabled) return index === 0 ? true : false;

              const firstInstaBuyIndex = array.findIndex(el => el.dataset.label === LABELS.instabuy);
              const firstInstaSellIndex = array.findIndex(el => el.dataset.label === LABELS.instasell);
              return index === firstInstaBuyIndex || index === firstInstaSellIndex;
            },
          },
          //@ts-ignore
          crosshair: {
            line: {
              color: '#F4256D',
              width: 1,
            },
            zoom: {
              enabled: false,
            },
            sync: {
              enabled: true, // enable trace line syncing with other charts
              group: 1, // chart group
              suppressTooltips: false, // suppress tooltips when showing a synced tracer
            },
            snap: {
              enabled: true,
            },
          },
          legend: {
            labels: {
              filter: legendItem => {
                if (longTermPricesEnabled && legendItem.text === LABELS.average) return true;
                if (
                  !longTermPricesEnabled &&
                  (legendItem.text === LABELS.instabuy || legendItem.text === LABELS.instasell)
                )
                  return true;

                return false;
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        hover: {
          intersect: false,
        },
      }}
    />
  );
};

export default PriceChart;
