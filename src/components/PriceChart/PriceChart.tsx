import type { RealTimePrices } from '../../pages/item/[...slug]';
import { useMemo } from 'react';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import { useQuery } from 'react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchPricing } from '../../pages/item/[...slug]';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PriceChart = ({ id }: { id: number }) => {
  const {
    data: pricingData,
    isLoading: pricingIsLoading,
    isFetching: pricingIsFetching,
  } = useQuery<RealTimePrices>('pricing_5m', async () => fetchPricing(id), {
    refetchIntervalInBackground: true,
    refetchInterval: 60 * 1000,
  });
  const pricing = pricingData ? pricingData.data : null;
  const stringifiedPricing = JSON.stringify(pricing);

  const labels = useMemo(
    () => pricing?.map(interval => formatDistanceToNow(fromUnixTime(interval.timestamp))),
    [stringifiedPricing],
  );
  const averageHighPrices = useMemo(() => pricing?.map(interval => interval.avgHighPrice), [stringifiedPricing]);
  const averageLowPrices = useMemo(() => pricing?.map(interval => interval.avgLowPrice), [stringifiedPricing]);

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
      options={{ spanGaps: true }}
    />
  );
};

export default PriceChart;
