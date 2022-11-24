import { QueryFunction, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ItemPageItem } from '../../../pages/item/[slug]';
import DownArrowIcon from '../Icons/ArrowIcon';
import {
  DailyVolumes,
  HOMEPAGE_QUERIES,
  LatestTransactions,
  calculateMargin,
  calculatePotentialProfit,
  calculateROI,
  distanceToNowStrictFromUnixTime,
  fetchDailyVolumes,
  roiOutput,
} from '../ItemTable/ItemTableProvider';

type ItemInfoGridProps = { item: ItemPageItem | null };

type GridCellProps = {
  children?: React.ReactNode;
};

type GridLabelProps = {
  children?: React.ReactNode;
};

type GridFlexWrapperProps = {
  children?: React.ReactNode;
};

type GridSmallTextProps = {
  children?: React.ReactNode;
};

export const ItemInfoGrid = ({ item }: ItemInfoGridProps) => {
  const id = item?.id;
  const {
    data: latestTransactionData,
    isLoading: latestTransactionIsLoading,
    isFetching: latestTransactionIsFetching,
  } = useQuery<LatestTransactions>(['latest_transaction', { id }], fetchLatestTransactions, {
    refetchInterval: 60 * 1000, // 1 min
  });
  const {
    data: dailyVolumes,
    isLoading: dailyVolumeLoading,
    isFetching: dailyVolumeFetching,
  } = useQuery<DailyVolumes>([HOMEPAGE_QUERIES.dailyVolumes], fetchDailyVolumes, {
    refetchInterval: 24 * 60 * 60 * 1000, // 24 hrs
  });
  const latestTransaction = id ? latestTransactionData?.data[id] : null;
  const dailyVolume = item?.id ? dailyVolumes?.data[item.id.toString()] : null;

  console.log(item);

  return (
    <div className="grid w-fit grid-cols-2 gap-y-2 gap-x-10 font-plex-sans">
      <GridCell>
        <GridLabel>Buy Price</GridLabel>
        <GridFlexWrapper>
          <span>{latestTransaction?.high?.toLocaleString()}</span>
          <GridSmallText>
            {distanceToNowStrictFromUnixTime({ unixTime: latestTransaction?.highTime, addSuffix: true })}
          </GridSmallText>
          <DownArrowIcon className=" fill-[#38c744]" />
        </GridFlexWrapper>
      </GridCell>
      <GridCell>
        <GridLabel>High Alch</GridLabel>
        <span>{item?.highalch?.toLocaleString()}</span>
      </GridCell>
      <GridCell>
        <GridLabel>Sell Price</GridLabel>
        <GridFlexWrapper>
          <span>{latestTransaction?.low?.toLocaleString()}</span>
          <GridSmallText>
            {distanceToNowStrictFromUnixTime({ unixTime: latestTransaction?.lowTime, addSuffix: true })}
          </GridSmallText>
          <DownArrowIcon className="rotate-180 fill-[#F4256D]" />
        </GridFlexWrapper>
      </GridCell>
      <GridCell>
        <GridLabel>Low Alch</GridLabel>
        <span>{item?.lowalch?.toLocaleString()}</span>
      </GridCell>
      <GridCell>
        <GridLabel>Volume</GridLabel>
        <GridFlexWrapper>
          <div>{dailyVolume?.toLocaleString()}</div>
          <GridSmallText>per day</GridSmallText>
        </GridFlexWrapper>
      </GridCell>
      <GridCell>
        <GridLabel>Margin</GridLabel>
        <span>{calculateMargin(latestTransaction?.high, latestTransaction?.low)?.toLocaleString()}</span>
      </GridCell>
      <GridCell>
        <GridLabel>Potential Profit</GridLabel>
        <span>
          {calculatePotentialProfit(latestTransaction?.high, latestTransaction?.low, item?.limit)?.toLocaleString()}
        </span>
      </GridCell>
      <GridCell>
        <GridLabel>Buy Limit</GridLabel>
        <span>{item?.limit?.toLocaleString()}</span>
      </GridCell>
      <GridCell>
        <GridLabel>ROI</GridLabel>
        <span>{roiOutput(calculateROI(latestTransaction?.high, latestTransaction?.low))}</span>
      </GridCell>
    </div>
  );
};

const GridCell = ({ children }: GridCellProps) => <div className="flex gap-2">{children}</div>;

const GridLabel = ({ children }: GridLabelProps) => {
  return <div className="place-self-center justify-self-end whitespace-nowrap text-base font-bold">{children}</div>;
};

const GridFlexWrapper = ({ children }: GridFlexWrapperProps) => (
  <div className="flex items-center gap-2">{children}</div>
);

const GridSmallText = ({ children }: GridSmallTextProps) => <span className="text-center text-xs">{children}</span>;

const fetchLatestTransactions: QueryFunction<LatestTransactions> = async ({ queryKey }) => {
  const [_key, { id }] = queryKey as [string, { id: ItemInfoGridProps['item'] }];
  return axios
    .get<LatestTransactions>(`https://prices.runescape.wiki/api/v1/osrs/latest/?id=${id}`)
    .then(res => res.data);
};
