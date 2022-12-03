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
  calculateProfit,
  calculateTax,
  distanceToNowStrictFromUnixTime,
  fetchDailyVolumes,
  roiOutput,
} from '../ItemTable/ItemTableProvider';

type ItemInfoGridProps = { item: ItemPageItem | null };

type GridGroupProps = {
  label: string;
  children?: React.ReactNode;
};

type GridCellProps = {
  children?: React.ReactNode;
};

type GridLabelProps = {
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

  return (
    <div className="grid w-fit grid-cols-2 gap-y-0.5 gap-x-5 rounded-lg bg-slate-100 py-4 px-6 font-plex-sans dark:bg-gray-800 xl:grid-cols-[min-content_auto_min-content_auto]">
      <GridGroup label="Buy Price">
        <span>{latestTransaction?.high?.toLocaleString()}</span>
        <GridSmallText>
          {distanceToNowStrictFromUnixTime({ unixTime: latestTransaction?.highTime, addSuffix: true })}
        </GridSmallText>
        <DownArrowIcon className=" shrink-0 fill-[#38c744]" />
      </GridGroup>

      <GridGroup label="High Alch">{item?.highalch?.toLocaleString()}</GridGroup>
      <GridGroup label="Sell Price">
        <span>{latestTransaction?.low?.toLocaleString()}</span>
        <GridSmallText>
          {distanceToNowStrictFromUnixTime({ unixTime: latestTransaction?.lowTime, addSuffix: true })}
        </GridSmallText>
        <DownArrowIcon className="shrink-0 rotate-180 fill-[#F4256D]" />
      </GridGroup>

      <GridGroup label="Low Alch">{item?.lowalch?.toLocaleString()}</GridGroup>

      <GridGroup label="Margin">
        {calculateMargin(latestTransaction?.high, latestTransaction?.low)?.toLocaleString()}
      </GridGroup>
      <GridGroup label="Volume">
        {dailyVolume ? (
          <>
            <div>{dailyVolume.toLocaleString()}</div>
            <GridSmallText>per day</GridSmallText>
          </>
        ) : null}
      </GridGroup>
      <GridGroup label="Tax">{calculateTax(latestTransaction?.high).toLocaleString()}</GridGroup>
      <GridGroup label="Buy Limit">
        {item?.limit ? (
          <>
            <div>{item?.limit?.toLocaleString()}</div>
            <GridSmallText>/ 4 hours</GridSmallText>
          </>
        ) : null}
      </GridGroup>
      <GridGroup label="Profit">
        {calculateProfit(latestTransaction?.high, latestTransaction?.low)?.toLocaleString()}
      </GridGroup>
      <GridGroup label="Potential Profit">
        {calculatePotentialProfit(latestTransaction?.high, latestTransaction?.low, item?.limit)?.toLocaleString()}
      </GridGroup>
      <GridGroup label="ROI">
        {roiOutput({ instaBuyPrice: latestTransaction?.high, instaSellPrice: latestTransaction?.low })}
      </GridGroup>
    </div>
  );
};

const GridGroup = ({ label, children }: GridGroupProps) => (
  <>
    <GridCell>
      <GridLabel>{label}</GridLabel>
    </GridCell>
    <GridCell>{children}</GridCell>
  </>
);

const GridCell = ({ children }: GridCellProps) => <div className="flex items-center gap-2 text-base">{children}</div>;

const GridLabel = ({ children }: GridLabelProps) => {
  return <div className="w-full whitespace-nowrap text-lg font-bold">{children}</div>;
};

const GridSmallText = ({ children }: GridSmallTextProps) => <span className="text-center text-xs">{children}</span>;

const fetchLatestTransactions: QueryFunction<LatestTransactions> = async ({ queryKey }) => {
  const [_key, { id }] = queryKey as [string, { id: ItemInfoGridProps['item'] }];
  return axios
    .get<LatestTransactions>(`https://prices.runescape.wiki/api/v1/osrs/latest/?id=${id}`)
    .then(res => res.data);
};
