import { Collapse, Container } from '@nextui-org/react';
import { BasicItem } from '../../db/items';
import ItemIcon from '../ItemIcon/ItemIcon';
import PriceChart from '../PriceChart/PriceChart';
import PriceChartProvider from '../PriceChart/PriceChartProvider';
import TimeIntervalButtonGroup from '../TimeIntervalButtonGroup/TimeIntervalButtonGroup';

const GrandExchangeCollapse = ({ item }: { item: BasicItem }) => (
  <Collapse
    title="Grand Exchange"
    contentLeft={<ItemIcon icon={item.icon} name={item.name} width={50} height={45} />}
    subtitle={`Pricing information for ${item.name}`}
    disabled={item.tradeable_on_ge === false}
    expanded={item.tradeable_on_ge !== false}
    css={{ userSelect: 'none' }}
  >
    <PriceChartProvider>
      <Container display="flex" alignItems="center" justify="flex-end">
        <TimeIntervalButtonGroup />
      </Container>
      <PriceChart id={item.id} />
    </PriceChartProvider>
  </Collapse>
);

export default GrandExchangeCollapse;
