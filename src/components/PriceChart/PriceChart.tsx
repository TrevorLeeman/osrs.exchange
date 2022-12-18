import { useTheme as useNextUiTheme } from '@nextui-org/react';
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
import enUS from 'date-fns/locale/en-US';
import { Line } from 'react-chartjs-2';

import { usePriceChartContext } from '../../hooks/usePriceChartContext';

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

const PriceChart = () => {
  const { isDark } = useNextUiTheme();
  const {
    realTimeInstaBuyPrices,
    averageLongTermPrices,
    realTimeInstaSellPrices,
    longTermPricesEnabled,
    lineLabels,
    xAxisLabels,
    theme,
  } = usePriceChartContext();
  const gridColor = isDark ? theme.colors.gridLines.dark : theme.colors.gridLines.light;

  return (
    <Line
      className="max-h-[50vh]"
      data={{
        labels: xAxisLabels,
        datasets: [
          {
            label: lineLabels.instabuy,
            backgroundColor: isDark ? theme.colors.buy.dark : theme.colors.buy.light,
            pointRadius: 2,
            borderColor: theme.colors.buy.border,
            data: realTimeInstaBuyPrices,
            cubicInterpolationMode: 'monotone',
            showLine: !longTermPricesEnabled,
          },
          {
            label: lineLabels.instasell,
            backgroundColor: isDark ? theme.colors.sell.dark : theme.colors.sell.light,
            pointRadius: 2,
            borderColor: theme.colors.sell.border,
            data: realTimeInstaSellPrices,
            cubicInterpolationMode: 'monotone',
            showLine: !longTermPricesEnabled,
          },
          {
            label: lineLabels.average,
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
        aspectRatio: 1 / 2,
        resizeDelay: 50,
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

              const firstInstaBuyIndex = array.findIndex(el => el.dataset.label === lineLabels.instabuy);
              const firstInstaSellIndex = array.findIndex(el => el.dataset.label === lineLabels.instasell);
              return index === firstInstaBuyIndex || index === firstInstaSellIndex;
            },
          },
          //@ts-ignore
          crosshair: {
            line: {
              color: theme.colors.crosshair.border,
              width: 1,
              dashPattern: [10, 5],
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
                if (longTermPricesEnabled && legendItem.text === lineLabels.average) return true;
                if (
                  !longTermPricesEnabled &&
                  (legendItem.text === lineLabels.instabuy || legendItem.text === lineLabels.instasell)
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
