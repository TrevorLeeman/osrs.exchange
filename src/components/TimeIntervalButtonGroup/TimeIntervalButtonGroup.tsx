import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Button } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { useQueryClient } from 'react-query';
import { ITEM_PAGE_QUERIES } from '../../pages/item/[...slug]';
import { PriceChartContext } from '../PriceChart/PriceChartProvider';

export type Timestep = '5m' | '1h' | '6h';

type TimeIntervalButtonProps = {
  title: string;
  timestep: Timestep;
};

const TimeIntervalButtonGroup = () => {
  return (
    <Button.Group color="primary" bordered>
      <TimeIntervalButton title="Day" timestep="5m" />
      <TimeIntervalButton title="Week" timestep="1h" />
      <TimeIntervalButton title="Month" timestep="6h" />
    </Button.Group>
  );
};

const TimeIntervalButton = ({ title, timestep }: TimeIntervalButtonProps) => {
  const queryClient = useQueryClient();
  const { timestep: selectedTimestep, setTimestep } = useContext(PriceChartContext);
  const active = selectedTimestep === timestep;
  const css = active
    ? { backgroundColor: '$blue600', color: '$white' }
    : { '&:hover': { backgroundColor: '$blue100' } };

  return (
    <Button
      css={css}
      onPress={e => {
        setTimestep(() => timestep);
        queryClient.invalidateQueries(ITEM_PAGE_QUERIES.realTimePrices);
      }}
      aria-pressed={active}
    >
      {title}
    </Button>
  );
};

export default TimeIntervalButtonGroup;
