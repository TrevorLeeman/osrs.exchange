import { Container } from '@nextui-org/react';

import { BasicItem } from '../../db/items';
import PriceChart from './PriceChart';
import PriceChartProvider from './PriceChartProvider';
import TimeIntervalButtonGroup from './TimeIntervalButtonGroup';

type PriceChartWithControlsProps = {
  item: BasicItem;
};

const PriceChartWithControls = ({ item }: PriceChartWithControlsProps) => (
  <PriceChartProvider>
    <Container display="flex" alignItems="center" justify="flex-end">
      <TimeIntervalButtonGroup />
    </Container>
    <PriceChart id={item.id} />
  </PriceChartProvider>
);

export default PriceChartWithControls;
