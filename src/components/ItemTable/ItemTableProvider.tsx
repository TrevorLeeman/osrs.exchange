import { Dispatch, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { QueryFunction, useQuery } from '@tanstack/react-query';
import {
  PaginationState,
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
import { useLocalStorage } from 'usehooks-ts';

import { HomepageMappingItem, HomepageMappingItems } from '../../../pages/api/homepage_items';
import ItemIcon from '../ItemIcon/ItemIcon';
import { TaxCell } from './Cells/Tax';

type LatestPrices = {
  data: {
    [id: string]: {
      high: number | null;
      highTime: number | null;
      low: number | null;
      lowTime: number | null;
    };
  };
};

type DailyVolumes = {
  timestamp: number;
  data: {
    [id: string]: number;
  };
};

type TableCompleteItem = {
  id: number;
  name: string;
  limit: number;
  icon: string;
  value: number;
  lowalch: number;
  highalch: number;
  members: boolean;
  instaBuyPrice: number | null | undefined;
  instaBuyTime: number | null | undefined;
  instaSellPrice: number | null | undefined;
  instaSellTime: number | null | undefined;
  dailyVolume: number | undefined;
  tax: number | null | undefined;
  roi: number | null | undefined;
  potentialProfit: number | null | undefined;
};

type ItemTableProviderProps = {
  children?: React.ReactNode;
  updateUrlOnPagination?: boolean;
};

type ItemTableContextType = {
  items: TableCompleteItem[];
  table: Table<TableCompleteItem>;
  setPageIndex: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
};

const HOMEPAGE_QUERIES = {
  latestPrices: 'latest_prices',
  dailyVolumes: 'daily_volumes',
  itemMapping: 'item_mapping',
};

const fetchLatestPrices: QueryFunction<LatestPrices> = async () => {
  return axios.get<LatestPrices>('https://prices.runescape.wiki/api/v1/osrs/latest').then(res => res.data);
};

const fetchDailyVolumes: QueryFunction<DailyVolumes> = async () => {
  return axios.get<DailyVolumes>('https://prices.runescape.wiki/api/v1/osrs/volumes').then(res => res.data);
};

const fetchHomepageMappingItems: QueryFunction<HomepageMappingItem[]> = async () => {
  return axios
    .get<HomepageMappingItems>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/homepage_items`)
    .then(res => JSON.parse(res.data.items));
};

const calculateTax = (sellPrice: number | null | undefined) => {
  if (!sellPrice || sellPrice < 100) return 0;
  if (sellPrice >= 500_000_000) return 5_000_000;
  return Math.floor(sellPrice * 0.01);
};

const calculateROI = (instaBuyPrice: number | null | undefined, instaSellPrice: number | null | undefined) => {
  if (!instaBuyPrice || !instaSellPrice) return null;
  return ((instaBuyPrice - (instaSellPrice + calculateTax(instaSellPrice))) / instaBuyPrice) * 100;
};

// const calculatePotentialProfit = ()

// const calculateHighAlchProfit = ()

const distanceToNowFromUnixTime = (unixTime: number | null | undefined) => {
  if (!unixTime) return null;
  return formatDistanceToNowStrict(fromUnixTime(unixTime));
};

const columnHelper = createColumnHelper<TableCompleteItem>();

const defaultColumns = [
  columnHelper.accessor('icon', {
    header: 'Icon',
    cell: info => <ItemIcon icon={info.getValue()} name={info.row.original.name} width={30} />,
    enableSorting: false,
  }),
  // columnHelper.accessor('id', { cell: info => info.getValue() }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => <Link href={`/item/${info.row.original.id}`}>{info.getValue()}</Link>,
    enableHiding: true,
    enableSorting: true,
    sortingFn: 'text',
  }),
  columnHelper.accessor('dailyVolume', { header: 'Daily Volume', cell: info => info.getValue()?.toLocaleString() }),
  columnHelper.accessor('limit', { header: 'Limit', cell: info => info.getValue()?.toLocaleString() ?? 'Unknown' }),
  columnHelper.accessor('instaSellPrice', { header: 'Instasell', cell: info => info.getValue()?.toLocaleString() }),
  columnHelper.accessor('instaBuyPrice', {
    header: 'Instabuy',
    cell: info => info.getValue()?.toLocaleString(),
  }),
  columnHelper.accessor('roi', { header: 'ROI', cell: info => `${info.getValue()?.toFixed(1) ?? 0}%` }),
  // columnHelper.accessor('value', { header: 'Value', cell: info => info.getValue().toLocaleString() }),
  // columnHelper.accessor('lowalch', { header: 'Low Alch', cell: info => info.getValue().toLocaleString() }),
  // columnHelper.accessor('highalch', { header: 'High Alch', cell: info => info.getValue().toLocaleString() }),
  // columnHelper.accessor('members', { header: 'Members', cell: info => info.getValue() }),
  columnHelper.accessor('instaSellTime', {
    header: 'Instasell Time',
    cell: info => distanceToNowFromUnixTime(info.getValue()),
  }),
  columnHelper.accessor('instaBuyTime', {
    header: 'Instabuy Time',
    cell: info => distanceToNowFromUnixTime(info.getValue()),
  }),
  columnHelper.accessor('tax', { cell: info => <TaxCell tax={info.getValue()} /> }),
];

const ItemTableContext = createContext<ItemTableContextType>(undefined!);

export const ItemTableProvider: React.FC<ItemTableProviderProps> = ({ children, updateUrlOnPagination = true }) => {
  const {
    data: latestPrices,
    isLoading: latestPricesLoading,
    isFetching: latestPricesFetching,
  } = useQuery<LatestPrices>([HOMEPAGE_QUERIES.latestPrices], fetchLatestPrices, {
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
  } = useQuery<HomepageMappingItem[]>([HOMEPAGE_QUERIES.itemMapping], fetchHomepageMappingItems, {
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(!isNaN(Number(router.query?.page)) ? Number(router.query.page) - 1 : 0);
  const [pageSize, setPageSize] = useLocalStorage('pageSize', 10);
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
            potentialProfit: 0,
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
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    if (updateUrlOnPagination) {
      router.push({ pathname: router.pathname, query: { ...router.query, page: pageIndex + 1 } }, undefined, {
        scroll: false,
        shallow: true,
      });
    }
  }, [pageIndex, updateUrlOnPagination]);

  return (
    <ItemTableContext.Provider value={{ items: completeItems ?? [], ...{ table }, setPageIndex, setPageSize }}>
      {children}
    </ItemTableContext.Provider>
  );
};

export const useItemTableContext = () => {
  return useContext(ItemTableContext);
};
