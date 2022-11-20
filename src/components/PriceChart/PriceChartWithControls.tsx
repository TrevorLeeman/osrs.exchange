import { BasicItem } from '../../db/items';
import PriceChart from './PriceChart';
import PriceChartProvider from './PriceChartProvider';
import TimeIntervalButtonGroup from './TimeIntervalButtonGroup';

type PriceChartWithControlsProps = {
  item: BasicItem;
};

const PriceChartWithControls = ({ item }: PriceChartWithControlsProps) => (
  <PriceChartProvider>
    <div className="flex items-center justify-start md:justify-end">
      <TimeIntervalButtonGroup />
    </div>
    <PriceChart id={item.id} />
  </PriceChartProvider>
);

export default PriceChartWithControls;
