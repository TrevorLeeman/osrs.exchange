import React, { Dispatch, SetStateAction, createContext, useContext, useMemo } from 'react';

import { QueryFunction, useQuery } from '@tanstack/react-query';
import {
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
import locale from 'date-fns/locale/en-US';
import { useLocalStorage, useUpdateEffect } from 'usehooks-ts';

import { HomepageMappingItem, HomepageMappingItems } from '../../../pages/api/homepage_items';
import useNextQueryParams from '../../hooks/useNextQueryParams';
import ItemIcon from '../ItemIcon/ItemIcon';
import NameCell from './Cells/Name';
import TaxCell from './Cells/Tax';

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

export type TableCompleteItem = {
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
  setPageIndex: (state: number) => void;
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

const calculateTax = (instaBuyPrice: number | null | undefined) => {
  if (!instaBuyPrice || instaBuyPrice < 100) return 0;
  if (instaBuyPrice >= 500_000_000) return 5_000_000;
  return Math.floor(instaBuyPrice * 0.01);
};

const calculateROI = (instaBuyPrice: number | null | undefined, instaSellPrice: number | null | undefined) => {
  if (!instaBuyPrice || !instaSellPrice) return null;
  return ((instaBuyPrice - (instaSellPrice + calculateTax(instaSellPrice))) / instaSellPrice) * 100;
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
    header: () => <div className="text-center">Icon</div>,
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
    cell: info => info.getValue()?.toLocaleString() ?? '??',
    enableSorting: true,
  }),
  columnHelper.accessor('instaSellPrice', {
    header: 'Instasell',
    cell: info => info.getValue()?.toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor('instaBuyPrice', {
    header: 'Instabuy',
    cell: info => info.getValue()?.toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor('roi', {
    header: 'ROI',
    cell: info => `${info.getValue()?.toFixed(1) ?? 0}%`,
    enableSorting: true,
  }),
  // columnHelper.accessor('value', { header: 'Value', cell: info => info.getValue().toLocaleString() }),
  // columnHelper.accessor('lowalch', { header: 'Low Alch', cell: info => info.getValue().toLocaleString() }),
  // columnHelper.accessor('highalch', { header: 'High Alch', cell: info => info.getValue().toLocaleString() }),
  // columnHelper.accessor('members', { header: 'Members', cell: info => info.getValue() }),
  columnHelper.accessor('instaSellTime', {
    header: 'Instasell Time',
    cell: info => distanceToNowFromUnixTime(info.getValue()),
    enableSorting: true,
  }),
  columnHelper.accessor('instaBuyTime', {
    header: 'Instabuy Time',
    cell: info => distanceToNowFromUnixTime(info.getValue()),
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

  const [pageIndex, setPageIndex] = useNextQueryParams(
    'page',
    0,
    pageIndex => encodeURIComponent(pageIndex + 1),
    pageIndex => (Number(pageIndex) !== NaN ? Number(pageIndex) - 1 : 10),
  );
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

  // useIsomorphicLayoutEffect(() => {
  //   window.document.title = `OSRS Exchange${pageIndex ? ` | Item Page ${pageIndex + 1}` : ''}`;
  // }, [pageIndex]);

  useUpdateEffect(() => {
    setPageIndex(0);
  }, [pageSize]);

  return (
    <ItemTableContext.Provider value={{ items: completeItems ?? [], ...{ table }, setPageIndex, setPageSize }}>
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
