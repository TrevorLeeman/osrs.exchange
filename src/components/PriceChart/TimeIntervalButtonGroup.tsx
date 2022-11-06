import { useContext } from 'react';

import { Button } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';

import { ITEM_PAGE_QUERIES } from '../../../pages/item/[slug]';
import { PriceChartContext } from './PriceChartProvider';

export type Timestep = '5m' | '1h' | '6h' | '1y' | 'all';

type TimeIntervalButtonProps = {
  title: string;
  timestep: Timestep;
};

const TimeIntervalButtonGroup = () => {
  return (
    <Button.Group color="primary" bordered>
      <TimeIntervalButton title="All" timestep="all" />
      <TimeIntervalButton title="Year" timestep="1y" />
      <TimeIntervalButton title="Month" timestep="6h" />
      <TimeIntervalButton title="Week" timestep="1h" />
      <TimeIntervalButton title="Day" timestep="5m" />
    </Button.Group>
  );
};

const TimeIntervalButton = ({ title, timestep }: TimeIntervalButtonProps) => {
  const queryClient = useQueryClient();
  const { timestep: selectedTimestep, setTimestep, setLongTermPricesEnabled } = useContext(PriceChartContext);
  const active = selectedTimestep === timestep;

  return (
    <Button
      className={`${active ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}
      onPress={e => {
        setTimestep(() => timestep);
        switch (timestep) {
          case '5m':
          case '1h':
          case '6h':
            setLongTermPricesEnabled(false);
            queryClient.invalidateQueries([ITEM_PAGE_QUERIES.realTimePrices]);
            break;
          case '1y':
          case 'all':
            setLongTermPricesEnabled(true);
            queryClient.invalidateQueries([ITEM_PAGE_QUERIES.longTermPrices]);
            break;
        }
      }}
      aria-pressed={active}
    >
      {title}
    </Button>
  );
};

export default TimeIntervalButtonGroup;
