import React from 'react';

import { Collapse } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';

import { ItemPageItem } from '../../../pages/item/[slug]';
import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
import {
  calculateMargin,
  calculatePotentialProfit,
  calculateProfit,
  calculateTax,
  distanceToNowStrictFromUnixTime,
  roiOutput,
} from '../../util/calculations';
import {
  DailyVolumes,
  ITEM_TABLE_QUERIES,
  LatestTransactions,
  fetchDailyVolumes,
  fetchLatestTransactions,
} from '../../util/queries';
import DownArrowIcon from '../Icons/Arrow';
import { columnHeaders } from '../ItemTable/ItemTableProvider';

export type ItemInfoGridProps = { item: ItemPageItem | null; uid?: string };

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
    <Collapse
      title={<span className="text-lg font-semibold">Pricing Info</span>}
      divider={false}
      className="rounded-lg bg-slate-100 px-6 dark:bg-slate-800"
    >
      <ItemInfoGrid item={item} />
    </Collapse>
  ) : (
    <ItemInfoGrid item={item} />
  );
};

const ItemInfoGrid = ({ item, uid }: ItemInfoGridProps) => {
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
  } = useQuery<DailyVolumes>([ITEM_TABLE_QUERIES.dailyVolumes], fetchDailyVolumes, {
    refetchInterval: 24 * 60 * 60 * 1000, // 24 hrs
  });
  const latestTransaction = id ? latestTransactionData?.data[id] : null;
  const dailyVolume = item?.id ? dailyVolumes?.data[item.id.toString()] : null;

  return (
    <div className="flex w-full flex-col rounded-lg bg-slate-100 font-plex-sans dark:bg-slate-800 sm:w-fit sm:flex-row sm:gap-5 sm:py-4 sm:px-6">
      <GridSection>
        <LabelValueWrapper label={columnHeaders.instaBuyPrice}>
          <BuySellValueWrapper>
            <span>{latestTransaction?.high?.toLocaleString()}</span>
            <BuySellTime unixTime={latestTransaction?.highTime}>
              <DownArrowIcon className=" shrink-0 fill-[#38c744]" />
            </BuySellTime>
          </BuySellValueWrapper>
        </LabelValueWrapper>
        <LabelValueWrapper label={columnHeaders.instaSellPrice}>
          <BuySellValueWrapper>
            <span>{latestTransaction?.low?.toLocaleString()}</span>
            <BuySellTime unixTime={latestTransaction?.lowTime}>
              <DownArrowIcon className="shrink-0 rotate-180 fill-[#F4256D]" />
            </BuySellTime>
          </BuySellValueWrapper>
        </LabelValueWrapper>
        <LabelValueWrapper label={columnHeaders.margin}>
          {calculateMargin(latestTransaction?.high, latestTransaction?.low)?.toLocaleString()}
        </LabelValueWrapper>
        <LabelValueWrapper label={columnHeaders.tax}>
          {calculateTax(latestTransaction?.high).toLocaleString()}
        </LabelValueWrapper>
        <LabelValueWrapper label={columnHeaders.profit}>
          {calculateProfit(latestTransaction?.high, latestTransaction?.low)?.toLocaleString()}
        </LabelValueWrapper>
        <LabelValueWrapper label={columnHeaders.roi}>
          {roiOutput({ instaBuyPrice: latestTransaction?.high, instaSellPrice: latestTransaction?.low })}
        </LabelValueWrapper>
      </GridSection>
      <GridSection>
        <LabelValueWrapper label={columnHeaders.highAlch}>{item?.highalch?.toLocaleString()}</LabelValueWrapper>

        <LabelValueWrapper label={columnHeaders.lowAlch}>{item?.lowalch?.toLocaleString()}</LabelValueWrapper>

        <LabelValueWrapper label={columnHeaders.dailyVolume}>
          {dailyVolume ? (
            <>
              <div>{dailyVolume.toLocaleString()}</div>
              <GridSmallText>/ day</GridSmallText>
            </>
          ) : null}
        </LabelValueWrapper>

        {item?.limit ? (
          <>
            <LabelValueWrapper label={columnHeaders.limit}>
              <div>{item?.limit?.toLocaleString()}</div>
              <GridSmallText>/ 4 hours</GridSmallText>
            </LabelValueWrapper>
            <LabelValueWrapper label={columnHeaders.potentialProfit}>
              {calculatePotentialProfit(latestTransaction?.high, latestTransaction?.low, item?.limit)?.toLocaleString()}
              <GridSmallText>/ 4 hours</GridSmallText>
            </LabelValueWrapper>
          </>
        ) : null}
      </GridSection>
    </div>
  );
};

const GridSection = ({ children }: GridSectionProps) => (
  <div className="mt-4 grid h-min grid-cols-1 gap-x-3 sm:mt-0 sm:grid-cols-[min-content_auto]">{children}</div>
);

const LabelValueWrapper = ({ label, children }: LabelValueWrapperProps) => (
  <>
    <GridLabel>{label}</GridLabel>
    <GridValue>{children}</GridValue>
  </>
);

const GridLabel = ({ children }: GridLabelProps) => {
  return (
    <div className="mt-4 w-full min-w-[130px] self-center whitespace-nowrap text-lg font-bold leading-none text-indigo-600 first-of-type:mt-0 dark:text-yellow-400 sm:mt-0 sm:min-w-fit sm:leading-7">
      {children}
    </div>
  );
};

const GridValue = ({ children }: GridValueProps) => <div className="flex items-center gap-2 text-base">{children}</div>;

const GridSmallText = ({ children }: GridSmallTextProps) => <span className="text-center text-xs">{children}</span>;

const BuySellTime = ({ unixTime, children }: GridBuySellTimeProps) => (
  <div className="flex w-full flex-nowrap items-center gap-1 sm:justify-around">
    <GridSmallText>{distanceToNowStrictFromUnixTime({ unixTime: unixTime, addSuffix: true })}</GridSmallText>
    {children}
  </div>
);

const BuySellValueWrapper = ({ children }: BuySellValueWrapperProps) => (
  <div className="flex w-full flex-col justify-center sm:flex-row sm:items-center sm:justify-start sm:gap-2">
    {children}
  </div>
);
