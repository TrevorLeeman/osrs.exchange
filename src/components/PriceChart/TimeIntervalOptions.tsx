import { Key } from 'react';

import { Button, Dropdown } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import { Entries, StringKeyOf } from 'type-fest';

import { ITEM_PAGE_QUERIES } from '../../../pages/item/[slug]';
import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
import { usePriceChartContext } from './PriceChartProvider';

type TimeIntervalButtonProps = {
  title: string;
  timestep: Timestep;
  changeHandler: (timestep: Timestep) => void;
};

const timestepMap = { '5m': 'Day', '1h': 'Week', '6h': 'Month', '1y': 'Year', all: 'All Time' };

export type Timestep = StringKeyOf<typeof timestepMap>;

const TimeIntervalOptions = () => {
  const queryClient = useQueryClient();
  const isMaxMobileLarge = !useTailwindMinBreakpoint('sm');
  const { timestep: selectedTimestep, setTimestep, setLongTermPricesEnabled } = usePriceChartContext();

  const changeHandler = (timestep: Timestep) => {
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
  };

  return isMaxMobileLarge ? (
    <Dropdown isBordered={'true'}>
      <Dropdown.Button className="bg-blue-600">{timestepMap[selectedTimestep]} Prices</Dropdown.Button>
      <Dropdown.Menu onAction={changeHandler as (key: Key) => void} selectedKeys={[selectedTimestep]}>
        {(Object.entries(timestepMap) as Entries<typeof timestepMap>).map(([timestep, title]) => (
          <Dropdown.Item key={timestep}>{title}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <Button.Group color="primary" bordered>
      {(Object.entries(timestepMap) as Entries<typeof timestepMap>).map(([timestep, title]) => (
        <TimeIntervalButton key={timestep} title={title} timestep={timestep} changeHandler={changeHandler} />
      ))}
    </Button.Group>
  );
};

const TimeIntervalButton = ({ title, timestep, changeHandler }: TimeIntervalButtonProps) => {
  const { timestep: selectedTimestep } = usePriceChartContext();
  const active = selectedTimestep === timestep;

  return (
    <Button
      css={{
        backgroundColor: active ? 'rgb(37 99 235)' : undefined,
        color: active ? 'white' : undefined,
        '&:hover': {
          backgroundColor: !active ? 'rgb(219 234 254)' : undefined,
        },
      }}
      onPress={e => changeHandler(timestep)}
      aria-pressed={active}
    >
      {title}
    </Button>
  );
};

export default TimeIntervalOptions;
