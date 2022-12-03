import React, { Dispatch, SetStateAction, createContext, useCallback, useContext, useMemo } from 'react';

import { QueryFunction, useQuery } from '@tanstack/react-query';
import {
  Header,
  SortDirection,
  Table,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import fromUnixTime from 'date-fns/fromUnixTime';
import { useLocalStorage, useSessionStorage, useUpdateEffect } from 'usehooks-ts';

import { HomepageMappingItems } from '../../../pages/api/homepage_items';
import { WikiApiMappingItem } from '../../db/seeds/osrs_wiki_api_mapping';
import useNextQueryParams from '../../hooks/useNextQueryParams';
import ItemIcon from '../ItemIcon/ItemIcon';
import NameCell from './Cells/Name';
import TaxCell from './Cells/Tax';

export type LatestTransactions = {
  data: {
    [id: string]: LatestTransaction;
  };
};

type LatestTransaction = {
  high: number | null;
  highTime: number | null;
  low: number | null;
  lowTime: number | null;
};

export type DailyVolumes = {
  timestamp: number;
  data: {
    [id: string]: number;
  };
};

export type TableCompleteItem = {
  id: WikiApiMappingItem['id'];
  name: WikiApiMappingItem['name'];
  limit: WikiApiMappingItem['limit'];
  icon: WikiApiMappingItem['icon'];
  value: WikiApiMappingItem['value'];
  lowalch: WikiApiMappingItem['lowalch'];
  highalch: WikiApiMappingItem['highalch'];
  members: WikiApiMappingItem['members'];
  instaBuyPrice: number | null | undefined;
  instaBuyTime: number | null | undefined;
  instaSellPrice: number | null | undefined;
  instaSellTime: number | null | undefined;
  dailyVolume: number | undefined;
  tax: number | null | undefined;
  roi: number | null | undefined;
  profit: number | null | undefined;
  potentialProfit: number | null | undefined;
};

type ItemTableProviderProps = {
  children?: React.ReactNode;
  updateUrlOnPagination?: boolean;
};

type SortHandler = (params: { header: Header<TableCompleteItem, unknown> }) => void;

type SortDescNext = (params: { currentSortDirection: SortDirection | false }) => boolean;

type ItemTableContextType = {
  items: TableCompleteItem[];
  table: Table<TableCompleteItem>;
  setPageIndex: (state: number) => void;
  setPageSize: Dispatch<SetStateAction<number>>;
  sortHandler: SortHandler;
};

type DistanceToNowStrictFromUnixTime = (params: {
  unixTime: number | null | undefined;
  addSuffix?: boolean;
}) => string | null;

type RoiOutput = (params: {
  instaBuyPrice?: TableCompleteItem['instaBuyPrice'];
  instaSellPrice?: TableCompleteItem['instaSellPrice'];
  roi?: ReturnType<typeof calculateROI>;
}) => string | null;

type IsEmpty = (value: any) => boolean;

export const HOMEPAGE_QUERIES = {
  latestPrices: 'latest_prices',
  dailyVolumes: 'daily_volumes',
  itemMapping: 'item_mapping',
};

const columnHelper = createColumnHelper<TableCompleteItem>();

const defaultColumns = [
  columnHelper.accessor('icon', {
    header: () => <div className="grow text-center">Icon</div>,
    cell: info => (
      <div className="flex justify-center">
        <ItemIcon icon={info.getValue()} name={info.row.original.name} className="scale-110" />
      </div>
    ),
    enableSorting: false,
  }),
  // columnHelper.accessor('id', { cell: info => info.getValue() }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: context => <NameCell context={context} />,
    enableSorting: true,
    enableHiding: true,
    sortingFn: 'text',
  }),
  columnHelper.accessor('dailyVolume', {
    header: 'Daily Volume',
    cell: info => info.getValue()?.toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor('limit', {
    header: 'Limit',
    cell: info => info.getValue()?.toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor('instaSellPrice', {
    header: 'Sell Price',
    cell: info => info.getValue()?.toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor('instaBuyPrice', {
    header: 'Buy Price',
    cell: info => info.getValue()?.toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor('roi', {
    header: 'ROI',
    cell: info => roiOutput({ roi: info.getValue() }),
    enableSorting: true,
  }),
  // columnHelper.accessor('value', { header: 'Value', cell: info => info.getValue().toLocaleString() }),
  // columnHelper.accessor('lowalch', { header: 'Low Alch', cell: info => info.getValue().toLocaleString() }),
  // columnHelper.accessor('highalch', { header: 'High Alch', cell: info => info.getValue().toLocaleString() }),
  // columnHelper.accessor('members', { header: 'Members', cell: info => info.getValue() }),
  columnHelper.accessor('instaSellTime', {
    header: 'Latest Sell',
    cell: info => distanceToNowStrictFromUnixTime({ unixTime: info.getValue() }),
    enableSorting: true,
  }),
  columnHelper.accessor('instaBuyTime', {
    header: 'Latest Buy',
    cell: info => distanceToNowStrictFromUnixTime({ unixTime: info.getValue() }),
    enableSorting: true,
  }),
  columnHelper.accessor('tax', {
    header: 'Tax',
    cell: context => <TaxCell context={context} />,
    enableSorting: true,
  }),
];

const ItemTableContext = createContext<ItemTableContextType>(undefined!);

export const ItemTableProvider: React.FC<ItemTableProviderProps> = ({ children, updateUrlOnPagination = true }) => {
  const {
    data: latestPrices,
    isLoading: latestPricesLoading,
    isFetching: latestPricesFetching,
  } = useQuery<LatestTransactions>([HOMEPAGE_QUERIES.latestPrices], fetchLatestPrices, {
    refetchInterval: 60 * 1000, // 1 min
  });
  const {
    data: dailyVolumes,
    isLoading: dailyVolumeLoading,
    isFetching: dailyVolumeFetching,
  } = useQuery<DailyVolumes>([HOMEPAGE_QUERIES.dailyVolumes], fetchDailyVolumes, {
    refetchInterval: 24 * 60 * 60 * 1000, // 24 hrs
  });
  const {
    data: itemMappings,
    isLoading: itemMappingLoading,
    isFetching: itemMappingFetching,
  } = useQuery<WikiApiMappingItem[]>([HOMEPAGE_QUERIES.itemMapping], fetchHomepageMappingItems, {
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const [pageIndex, setPageIndex] = useNextQueryParams(
    'page',
    0,
    pageIndex => encodeURIComponent(pageIndex + 1),
    pageIndex => (Number(pageIndex) !== NaN ? Number(pageIndex) - 1 : 10),
  );
  const [pageSize, setPageSize] = useLocalStorage('pageSize', 10);
  const [sortOptions, setSortOptions] = useSessionStorage('sortOptions', [{ id: 'instaSellPrice', desc: true }]);
  // Store sort options in URL
  // const [sortOptions, setSortOptions] = useNextQueryParams(
  //   'sortOptions',
  //   [{ id: 'instaSellPrice', desc: true }],
  //   options => encodeURIComponent(JSON.stringify(options)),
  //   options =>
  //     typeof options === 'string' ? JSON.parse(decodeURIComponent(options)) : [{ id: 'instaSellPrice', desc: true }],
  // );

  const sortHandler: SortHandler = useCallback(({ header }) => {
    setSortOptions([
      { id: header.column.id, desc: sortDescNext({ currentSortDirection: header.column.getIsSorted() }) },
    ]);
  }, []);

  const completeItems = useMemo(
    () =>
      itemMappings
        ?.map(item => {
          const instaBuyPrice = latestPrices?.data[item.id]?.high;
          const instaSellPrice = latestPrices?.data[item.id]?.low;

          return {
            id: item.id,
            name: item.name,
            limit: item.limit,
            icon: item.icon,
            value: item.value,
            lowalch: item.lowalch,
            highalch: item.highalch,
            members: item.members,
            instaBuyPrice: instaBuyPrice ?? 0,
            instaBuyTime: latestPrices?.data[item.id]?.highTime,
            instaSellPrice: instaSellPrice ?? 0,
            instaSellTime: latestPrices?.data[item.id]?.lowTime,
            dailyVolume: dailyVolumes?.data[item.id],
            tax: calculateTax(latestPrices?.data[item.id]?.high),
            roi: calculateROI(instaBuyPrice, instaSellPrice),
            profit: calculateProfit(instaBuyPrice, instaSellPrice),
            potentialProfit: calculatePotentialProfit(instaBuyPrice, instaSellPrice, item.limit),
          };
        })
        // If an item does not have a recent buy or sell record, that indicates it is either a Deadman mode item, or an item that has been removed from the game. All of which we want to filter out.
        .filter(item => item.instaBuyTime || item.instaSellTime),
    [itemMappings, dailyVolumes, latestPrices],
  );

  const table = useReactTable({
    data: completeItems?.length ? completeItems : [],
    columns: defaultColumns,
    state: {
      sorting: sortOptions,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    sortDescFirst: true,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useUpdateEffect(() => {
    setPageIndex(0);
  }, [pageSize]);

  return (
    <ItemTableContext.Provider value={{ items: completeItems ?? [], table, setPageIndex, setPageSize, sortHandler }}>
      {children}
    </ItemTableContext.Provider>
  );
};

export const useItemTableContext = () => {
  const context = useContext(ItemTableContext);

  if (context === undefined) {
    throw new Error('useItemTableContext must be used within an ItemTableProvider');
  }

  return context;
};

const fetchLatestPrices: QueryFunction<LatestTransactions> = async () => {
  return axios.get<LatestTransactions>('https://prices.runescape.wiki/api/v1/osrs/latest').then(res => res.data);
};

export const fetchDailyVolumes: QueryFunction<DailyVolumes> = async () => {
  return axios.get<DailyVolumes>('https://prices.runescape.wiki/api/v1/osrs/volumes').then(res => res.data);
};

const fetchHomepageMappingItems: QueryFunction<WikiApiMappingItem[]> = async () => {
  return axios
    .get<HomepageMappingItems>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/homepage_items`)
    .then(res => JSON.parse(res.data.items));
};

export const calculateTax = (instaBuyPrice: TableCompleteItem['instaBuyPrice']) => {
  if (!instaBuyPrice || instaBuyPrice < 100) return 0;
  if (instaBuyPrice >= 500_000_000) return 5_000_000;
  return Math.floor(instaBuyPrice * 0.01);
};

export const calculateMargin = (
  instaBuyPrice: TableCompleteItem['instaBuyPrice'],
  instaSellPrice: TableCompleteItem['instaSellPrice'],
) => {
  if (!instaBuyPrice || !instaSellPrice) return null;
  return instaBuyPrice - instaSellPrice;
};

export const calculateProfit = (
  instaBuyPrice: TableCompleteItem['instaBuyPrice'],
  instaSellPrice: TableCompleteItem['instaSellPrice'],
) => {
  if (!instaBuyPrice || !instaSellPrice) return null;
  return Number((calculateMargin(instaBuyPrice, instaSellPrice)! - calculateTax(instaBuyPrice)).toFixed(0));
};

export const calculatePotentialProfit = (
  instaBuyPrice: TableCompleteItem['instaBuyPrice'],
  instaSellPrice: TableCompleteItem['instaSellPrice'],
  limit: TableCompleteItem['limit'],
) => {
  if (!instaBuyPrice || !instaSellPrice || !limit) return null;
  return Number((calculateProfit(instaBuyPrice, instaSellPrice)! * limit).toFixed(0));
};

export const calculateROI = (
  instaBuyPrice: TableCompleteItem['instaBuyPrice'],
  instaSellPrice: TableCompleteItem['instaSellPrice'],
) => {
  if (!instaBuyPrice || !instaSellPrice) return null;
  return (calculateProfit(instaBuyPrice, instaSellPrice)! / instaSellPrice) * 100;
};

export const roiOutput: RoiOutput = ({ instaBuyPrice, instaSellPrice, roi }) => {
  // Accept 0 as a valid roi using isEmpty
  let output = !isEmpty(roi) ? roi : calculateROI(instaBuyPrice, instaSellPrice);
  // Handle -0.00%
  if (!isEmpty(output) && output! < 0 && Math.abs(output!) < 0.01) {
    output = 0;
  }
  return !isEmpty(output) ? `${parseFloat(output!.toFixed(2))}%` : null;
};

// const calculateHighAlchProfit = ()

export const distanceToNowStrictFromUnixTime: DistanceToNowStrictFromUnixTime = ({ unixTime, addSuffix = false }) => {
  if (!unixTime) return null;
  return formatDistanceToNowStrict(fromUnixTime(unixTime), { addSuffix });
};

const sortDescNext: SortDescNext = ({ currentSortDirection }) => {
  switch (currentSortDirection) {
    case false:
      return true;
    case 'asc':
      return true;
    case 'desc':
      return false;
  }
};

const isEmpty: IsEmpty = value => {
  return value === null || value === undefined;
};
