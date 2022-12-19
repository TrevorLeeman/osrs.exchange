import React, { useCallback, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import {
  Header,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { StringKeyOf } from 'type-fest/source/string-key-of';
import { useLocalStorage, useSessionStorage, useUpdateEffect } from 'usehooks-ts';

import { WikiApiMappingItem } from '../../db/seeds/osrs_wiki_api_mapping';
import { ItemTableContext } from '../../hooks/useItemTableContext';
import useNextQueryParams from '../../hooks/useNextQueryParams';
import {
  calculateAlchProfit,
  calculateMargin,
  calculatePotentialProfit,
  calculateProfit,
  calculateROI,
  calculateTax,
  distanceToNowStrictFromUnixTime,
  roiOutput,
  sortDescNext,
} from '../../util/calculations';
import {
  DailyVolumes,
  ITEM_PAGE_QUERIES,
  ITEM_TABLE_QUERIES,
  LatestTransactions,
  RealTimePrices,
  fetchDailyVolumes,
  fetchHomepageMappingItems,
  fetchLatestPrices,
  fetchRealTimePrices,
} from '../../util/queries';
import ItemIcon from '../ItemIcon/ItemIcon';
import MembersCell from './Cells/Members';
import NameCell from './Cells/Name';
import SkeletonCell from './Cells/Skeleton';
import TaxCell from './Cells/Tax';

export type TableItem = {
  id: WikiApiMappingItem['id'];
  name: WikiApiMappingItem['name'];
  limit: WikiApiMappingItem['limit'];
  icon: WikiApiMappingItem['icon'];
  value: WikiApiMappingItem['value'] | null | undefined;
  shopProfit: number | null;
  lowAlch: WikiApiMappingItem['lowalch'];
  lowAlchProfit: number | null;
  highAlch: WikiApiMappingItem['highalch'];
  highAlchProfit: number | null;
  members: WikiApiMappingItem['members'];
  instaBuyPrice: number | null | undefined;
  instaBuyTime: number | null | undefined;
  instaSellPrice: number | null | undefined;
  instaSellTime: number | null | undefined;
  dailyVolume: number | undefined;
  margin: number;
  tax: number | null | undefined;
  roi: number | null | undefined;
  profit: number | null | undefined;
  potentialProfit: number | null | undefined;
};

export type ColumnVisibility =
  | {
      [key in StringKeyOf<TableItem>]: boolean;
    }
  | {};

type ItemTableProviderProps = {
  children?: React.ReactNode;
};

export type SortHandler = (params: { header: Header<TableItem, unknown> }) => void;

export const columnHeaders = {
  id: 'ID',
  name: 'Name',
  limit: 'Limit',
  icon: 'Icon',
  value: 'Value',
  lowAlch: 'Low Alch',
  lowAlchProfit: 'Low Alch Profit',
  highAlch: 'High Alch',
  highAlchProfit: 'High Alch Profit',
  members: 'Members',
  instaBuyPrice: 'Sell Price',
  instaBuyTime: 'Latest Sell',
  instaSellPrice: 'Buy Price',
  instaSellTime: 'Latest Buy',
  dailyVolume: 'Daily Volume',
  margin: 'Margin',
  tax: 'Tax',
  roi: 'ROI',
  profit: 'Profit',
  potentialProfit: 'Potential Profit',
};

const columnHelper = createColumnHelper<TableItem>();

const defaultColumns = [
  columnHelper.accessor('icon', {
    header: () => <div className="grow text-center">{columnHeaders.icon}</div>,
    cell: info => (
      <SkeletonCell>
        <div className="flex justify-center">
          <ItemIcon icon={info.getValue()} name={info.row.original.name} className="scale-110" />
        </div>
      </SkeletonCell>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('name', {
    header: columnHeaders.name,
    cell: context => (
      <SkeletonCell>
        <NameCell context={context} />
      </SkeletonCell>
    ),
    enableSorting: true,
    enableHiding: true,
    sortingFn: 'text',
  }),
  columnHelper.accessor('instaSellPrice', {
    header: columnHeaders.instaSellPrice,
    cell: info => <SkeletonCell>{info.getValue()?.toLocaleString()}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('instaBuyPrice', {
    header: columnHeaders.instaBuyPrice,
    cell: info => <SkeletonCell>{info.getValue()?.toLocaleString()}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('margin', {
    header: columnHeaders.margin,
    cell: info => <SkeletonCell>{info.getValue()?.toLocaleString()}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('tax', {
    header: columnHeaders.tax,
    cell: context => (
      <SkeletonCell>
        <TaxCell context={context} />
      </SkeletonCell>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor('profit', {
    header: columnHeaders.profit,
    cell: info => <SkeletonCell>{info.getValue()?.toLocaleString()}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('limit', {
    header: columnHeaders.limit,
    cell: info => <SkeletonCell>{info.getValue()?.toLocaleString()}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('potentialProfit', {
    header: columnHeaders.potentialProfit,
    cell: info => <SkeletonCell>{info.getValue()?.toLocaleString()}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('roi', {
    header: columnHeaders.roi,
    cell: info => <SkeletonCell>{roiOutput({ roi: info.getValue() })}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('dailyVolume', {
    header: columnHeaders.dailyVolume,
    cell: info => <SkeletonCell>{info.getValue()?.toLocaleString()}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('instaSellTime', {
    header: columnHeaders.instaSellTime,
    cell: info => <SkeletonCell>{distanceToNowStrictFromUnixTime({ unixTime: info.getValue() })}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('instaBuyTime', {
    header: columnHeaders.instaBuyTime,
    cell: info => <SkeletonCell>{distanceToNowStrictFromUnixTime({ unixTime: info.getValue() })}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('highAlch', {
    header: columnHeaders.highAlch,
    cell: info => <SkeletonCell>{info.getValue()?.toLocaleString()}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('highAlchProfit', {
    header: columnHeaders.highAlchProfit,
    cell: info => <SkeletonCell>{info.getValue()?.toLocaleString()}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('lowAlch', {
    header: columnHeaders.lowAlch,
    cell: info => <SkeletonCell>{info.getValue()?.toLocaleString()}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('lowAlchProfit', {
    header: columnHeaders.lowAlchProfit,
    cell: info => <SkeletonCell>{info.getValue()?.toLocaleString()}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('members', {
    header: columnHeaders.members,
    cell: context => (
      <SkeletonCell>
        <MembersCell context={context} />
      </SkeletonCell>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor('value', {
    header: columnHeaders.value,
    cell: info => <SkeletonCell>{info.getValue()?.toLocaleString()}</SkeletonCell>,
    enableSorting: true,
  }),
  columnHelper.accessor('id', {
    header: columnHeaders.id,
    cell: info => <SkeletonCell>{info.getValue()}</SkeletonCell>,
    enableSorting: true,
  }),
];

const defaultColumnVisilibity: ColumnVisibility = {
  id: false,
  name: true,
  limit: true,
  icon: true,
  value: false,
  lowAlch: false,
  lowAlchProfit: false,
  highAlch: true,
  highAlchProfit: true,
  members: false,
  instaBuyPrice: true,
  instaBuyTime: true,
  instaSellPrice: true,
  instaSellTime: true,
  dailyVolume: true,
  margin: false,
  tax: false,
  roi: true,
  profit: true,
  potentialProfit: true,
};

export const ItemTableProvider: React.FC<ItemTableProviderProps> = ({ children }) => {
  const NATURE_RUNE_ID = 561;
  const { data: natureRuneData, isLoading: natureRuneDataLoading } = useQuery<RealTimePrices>(
    [ITEM_PAGE_QUERIES.realTimePrices, { id: NATURE_RUNE_ID, timestep: '5m' }],
    fetchRealTimePrices,
    {
      refetchInterval: 60 * 1000, // 1 min,
    },
  );
  const natureRunePrice = natureRuneData?.data[0].avgLowPrice;
  const { data: latestPrices, isSuccess: latestPricesReady } = useQuery<LatestTransactions>(
    [ITEM_TABLE_QUERIES.latestPrices],
    fetchLatestPrices,
    {
      refetchInterval: 60 * 1000, // 1 min
    },
  );
  const { data: dailyVolumes, isSuccess: dailyVolumesReady } = useQuery<DailyVolumes>(
    [ITEM_TABLE_QUERIES.dailyVolumes],
    fetchDailyVolumes,
    {
      refetchInterval: 24 * 60 * 60 * 1000, // 24 hrs
    },
  );
  const { data: itemMappings, isSuccess: itemMappingsReady } = useQuery<WikiApiMappingItem[]>(
    [ITEM_TABLE_QUERIES.itemMapping],
    fetchHomepageMappingItems,
    {
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  );

  const [columnVisibility, setColumnVisibility] = useLocalStorage('columnVisibility', defaultColumnVisilibity);
  const [pageIndex, setPageIndex] = useNextQueryParams(
    'page',
    0,
    pageIndex => encodeURIComponent(pageIndex + 1),
    pageIndex => (Number(pageIndex) !== NaN ? Number(pageIndex) - 1 : 10),
  );
  const [pageSize, setPageSize] = useLocalStorage('pageSize', 25);
  const [sortOptions, setSortOptions] = useSessionStorage('sortOptions', [{ id: 'instaBuyPrice', desc: true }]);

  // Store sort options in URL
  // const [sortOptions, setSortOptions] = useNextQueryParams(
  //   'sortOptions',
  //   [{ id: 'instaSellPrice', desc: true }],
  //   options => encodeURIComponent(JSON.stringify(options)),
  //   options =>
  //     typeof options === 'string' ? JSON.parse(decodeURIComponent(options)) : [{ id: 'instaSellPrice', desc: true }],
  // );

  const sortHandler: SortHandler = useCallback(({ header }) => {
    if (!header.column.columnDef.enableSorting) return;
    setSortOptions([
      { id: header.column.id, desc: sortDescNext({ currentSortDirection: header.column.getIsSorted() }) },
    ]);
  }, []);

  const tableDataReady = latestPricesReady && dailyVolumesReady && itemMappingsReady;

  const completeItems = useMemo(
    () =>
      tableDataReady
        ? itemMappings
            ?.map(item => {
              const instaBuyPrice = latestPrices?.data[item.id]?.high;
              const instaSellPrice = latestPrices?.data[item.id]?.low;

              return {
                id: item.id,
                name: item.name,
                limit: item.limit,
                icon: item.icon,
                value: item.value,
                lowAlch: item.lowalch,
                lowAlchProfit: calculateAlchProfit(instaSellPrice, item.lowalch, natureRunePrice),
                highAlch: item.highalch,
                highAlchProfit: calculateAlchProfit(instaSellPrice, item.highalch, natureRunePrice),
                members: item.members,
                instaBuyPrice: instaBuyPrice ?? 0,
                instaBuyTime: latestPrices?.data[item.id]?.highTime,
                instaSellPrice: instaSellPrice ?? 0,
                instaSellTime: latestPrices?.data[item.id]?.lowTime,
                dailyVolume: dailyVolumes?.data[item.id],
                margin: calculateMargin(instaBuyPrice, instaSellPrice),
                tax: calculateTax(latestPrices?.data[item.id]?.high),
                roi: calculateROI(instaBuyPrice, instaSellPrice),
                profit: calculateProfit(instaBuyPrice, instaSellPrice),
                potentialProfit: calculatePotentialProfit(instaBuyPrice, instaSellPrice, item.limit),
              };
            })
            // If an item does not have a recent buy or sell record, that indicates it is either a Deadman mode item, or an item that has been removed from the game. All of which we want to filter out.
            .filter(item => item.instaBuyTime || item.instaSellTime)
        : // Fill with empty rows equivalent to the current pageSize
          Array(pageSize).fill({}),
    [tableDataReady, itemMappings, dailyVolumes, latestPrices],
  );

  const table = useReactTable({
    data: completeItems?.length ? completeItems : [],
    columns: defaultColumns,
    state: {
      sorting: sortOptions,
      pagination: {
        pageIndex: tableDataReady ? pageIndex : 0,
        pageSize,
      },
      columnVisibility,
    },
    sortDescFirst: true,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useUpdateEffect(() => {
    setPageIndex(0);
  }, [pageSize, JSON.stringify(sortOptions)]);

  return (
    <ItemTableContext.Provider
      value={{
        items: completeItems ?? [],
        table,
        tableDataReady,
        setPageIndex,
        setPageSize,
        sortHandler,
        setColumnVisibility,
      }}
    >
      {children}
    </ItemTableContext.Provider>
  );
};
