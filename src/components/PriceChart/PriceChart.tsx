import { ITEM_PAGE_QUERIES, RealTimePrices } from '../../pages/item/[...slug]';
import { useContext, useMemo } from 'react';
import { formatDistanceToNow, fromUnixTime, subHours } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { useQuery } from 'react-query';
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
import { fetchPricing } from '../../pages/item/[...slug]';
import { PriceChartContext } from './PriceChartProvider';
import { Timestep } from '../TimeIntervalButtonGroup/TimeIntervalButtonGroup';

const TIMESTEP_TO_HOURS = new Map<Timestep, number>([
  ['5m', 24],
  ['1h', 7 * 24],
  ['6h', 30 * 24],
]);

ChartJS.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend);

const PriceChart = ({ id }: { id: number }) => {
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
            backgroundColor: 'rgb(84, 214, 95)',
            borderColor: 'rgb(84, 214, 95)',
            data: averageHighPrices,
            cubicInterpolationMode: 'monotone',
          },
          {
            label: 'Instasell Price',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
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
      }}
    />
  );
};

export default PriceChart;
