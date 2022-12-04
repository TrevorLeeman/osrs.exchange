import React from 'react';

import { Collapse } from '@nextui-org/react';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ItemPageItem } from '../../../pages/item/[slug]';
import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
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

type LabelValueWrapperProps = {
  label: string;
  children?: React.ReactNode;
};

type GridValueProps = {
  children?: React.ReactNode;
};

type GridLabelProps = {
  children?: React.ReactNode;
};

type GridSmallTextProps = {
  children?: React.ReactNode;
};

type GridSectionProps = {
  children?: React.ReactNode;
};

type GridBuySellTimeProps = {
  unixTime: LatestTransactions['data'][string]['highTime' | 'lowTime'];
  children?: React.ReactNode;
};

type BuySellValueWrapperProps = {
  children?: React.ReactNode;
};

export const ItemInfoGridDisplay = ({ item }: ItemInfoGridProps) => {
  const isMaxLargeMobile = !useTailwindMinBreakpoint('sm');

  return isMaxLargeMobile ? (
    <Collapse title={<span className="text-lg font-semibold">Pricing Info</span>}>
      <ItemInfoGrid item={item} />
    </Collapse>
  ) : (
    <ItemInfoGrid item={item} />
  );
};

const ItemInfoGrid = ({ item }: ItemInfoGridProps) => {
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
    // <div className="grid w-fit grid-cols-[min-content_auto] gap-y-0.5 gap-x-5 rounded-lg bg-slate-100 py-4 px-6 font-plex-sans dark:bg-gray-800 xl:grid-cols-[min-content_auto_min-content_auto]">
    <div className="flex w-full flex-col rounded-lg bg-slate-100 py-4 px-6 font-plex-sans dark:bg-gray-800 sm:w-fit sm:flex-row sm:gap-5">
      <GridSection>
        <LabelValueWrapper label="Buy Price">
          <div className="flex flex-col justify-center sm:flex-row sm:items-center sm:justify-start sm:gap-2">
            <span>{latestTransaction?.high?.toLocaleString()}</span>
            <BuySellTime unixTime={latestTransaction?.highTime}>
              <DownArrowIcon className=" shrink-0 fill-[#38c744]" />
            </BuySellTime>
          </div>
        </LabelValueWrapper>
        <LabelValueWrapper label="Sell Price">
          <BuySellValueWrapper>
            <span>{latestTransaction?.low?.toLocaleString()}</span>
            <BuySellTime unixTime={latestTransaction?.lowTime}>
              <DownArrowIcon className="shrink-0 rotate-180 fill-[#F4256D]" />
            </BuySellTime>
          </BuySellValueWrapper>
        </LabelValueWrapper>
        <LabelValueWrapper label="Margin">
          {calculateMargin(latestTransaction?.high, latestTransaction?.low)?.toLocaleString()}
        </LabelValueWrapper>
        <LabelValueWrapper label="Tax">{calculateTax(latestTransaction?.high).toLocaleString()}</LabelValueWrapper>
        <LabelValueWrapper label="Profit">
          {calculateProfit(latestTransaction?.high, latestTransaction?.low)?.toLocaleString()}
        </LabelValueWrapper>
        <LabelValueWrapper label="ROI">
          {roiOutput({ instaBuyPrice: latestTransaction?.high, instaSellPrice: latestTransaction?.low })}
        </LabelValueWrapper>
      </GridSection>
      <GridSection>
        <LabelValueWrapper label="High Alch">{item?.highalch?.toLocaleString()}</LabelValueWrapper>

        <LabelValueWrapper label="Low Alch">{item?.lowalch?.toLocaleString()}</LabelValueWrapper>

        <LabelValueWrapper label="Volume">
          {dailyVolume ? (
            <>
              <div>{dailyVolume.toLocaleString()}</div>
              <GridSmallText>/ day</GridSmallText>
            </>
          ) : null}
        </LabelValueWrapper>

        <LabelValueWrapper label="Buy Limit">
          {item?.limit ? (
            <>
              <div>{item?.limit?.toLocaleString()}</div>
              <GridSmallText>/ 4 hours</GridSmallText>
            </>
          ) : null}
        </LabelValueWrapper>

        <LabelValueWrapper label="Potential Profit">
          {calculatePotentialProfit(latestTransaction?.high, latestTransaction?.low, item?.limit)?.toLocaleString()}
        </LabelValueWrapper>
      </GridSection>
    </div>
  );
};

const GridSection = ({ children }: GridSectionProps) => (
  <div className="mt-4 grid grid-cols-1 gap-x-3 sm:mt-0 sm:grid-cols-[min-content_auto]">{children}</div>
);

const LabelValueWrapper = ({ label, children }: LabelValueWrapperProps) => (
  <>
    <GridLabel>{label}</GridLabel>
    <GridValue>{children}</GridValue>
  </>
);

const GridLabel = ({ children }: GridLabelProps) => {
  return (
    <div className="mt-4 w-full min-w-[130px] self-center whitespace-nowrap text-lg font-bold leading-none first-of-type:mt-0 sm:mt-0 sm:min-w-fit sm:leading-7">
      {children}
    </div>
  );
};

const GridValue = ({ children }: GridValueProps) => <div className="flex items-center gap-2 text-base">{children}</div>;

const GridSmallText = ({ children }: GridSmallTextProps) => <span className="text-center text-xs">{children}</span>;

const BuySellTime = ({ unixTime, children }: GridBuySellTimeProps) => (
  <div className="flex flex-nowrap items-center gap-1">
    <GridSmallText>{distanceToNowStrictFromUnixTime({ unixTime: unixTime, addSuffix: true })}</GridSmallText>
    {children}
  </div>
);

const BuySellValueWrapper = ({ children }: BuySellValueWrapperProps) => (
  <div className="flex flex-col justify-center sm:flex-row sm:items-center sm:justify-start sm:gap-2">{children}</div>
);

const fetchLatestTransactions: QueryFunction<LatestTransactions> = async ({ queryKey }) => {
  const [_key, { id }] = queryKey as [string, { id: ItemInfoGridProps['item'] }];
  return axios
    .get<LatestTransactions>(`https://prices.runescape.wiki/api/v1/osrs/latest/?id=${id}`)
    .then(res => res.data);
};
