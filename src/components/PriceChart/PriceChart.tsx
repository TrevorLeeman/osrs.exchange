import { ITEM_PAGE_QUERIES, RealTimePrices } from '../../../pages/item/[...slug]';
import { useContext, useMemo } from 'react';
import { useTheme as useNextUiTheme } from '@nextui-org/react';
import { formatDistanceToNow, fromUnixTime, subHours } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import Zoom from 'chartjs-plugin-zoom';
//@ts-ignore
import { CrosshairPlugin } from 'chartjs-plugin-crosshair';
import { fetchPricing } from '../../../pages/item/[...slug]';
import { PriceChartContext } from './PriceChartProvider';
import { Timestep } from '../TimeIntervalButtonGroup/TimeIntervalButtonGroup';

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
]);

const PriceChart = ({ id }: { id: number }) => {
  const { isDark } = useNextUiTheme();
  const { timestep } = useContext(PriceChartContext);
  const {
    data: pricingData,
    isLoading: pricingIsLoading,
    isFetching: pricingIsFetching,
  } = useQuery<RealTimePrices>([ITEM_PAGE_QUERIES.realTimePrices, { id, timestep }], fetchPricing, {
    refetchIntervalInBackground: true,
    refetchInterval: 60 * 1000,
  });

  const pricing = pricingData ? pricingData.data : null;
  const stringifiedLatestPrice = pricing?.length ? JSON.stringify(pricing[pricing.length - 1]) : null;

  const pricingFiltered = useMemo(
    () =>
      pricing?.filter(price => fromUnixTime(price.timestamp) > subHours(new Date(), TIMESTEP_TO_HOURS.get(timestep)!)),
    [stringifiedLatestPrice],
  );
  const labels = useMemo(
    () => pricingFiltered?.map(priceEntry => fromUnixTime(priceEntry.timestamp)),
    [stringifiedLatestPrice],
  );
  const averageHighPrices = useMemo(
    () => pricingFiltered?.map(priceEntry => priceEntry.avgHighPrice),
    [stringifiedLatestPrice],
  );
  const averageLowPrices = useMemo(
    () => pricingFiltered?.map(priceEntry => priceEntry.avgLowPrice),
    [stringifiedLatestPrice],
  );

  return (
    <Line
      data={{
        labels: labels,
        datasets: [
          {
            label: 'Instabuy Price',
            backgroundColor: isDark ? '#90ed99' : '#30a339',
            borderColor: '#38c744',
            data: averageHighPrices,
            cubicInterpolationMode: 'monotone',
          },
          {
            label: 'Instasell Price',
            backgroundColor: isDark ? '#F881AB' : '#a21144',
            borderColor: '#F4256D',
            data: averageLowPrices,
            cubicInterpolationMode: 'monotone',
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
          },
          //@ts-ignore
          crosshair: {
            line: {
              color: '#F4256D',
              width: 2,
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
