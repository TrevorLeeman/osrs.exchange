import React, { useMemo } from 'react';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { Container, Table, useTheme as useNextUiTheme } from '@nextui-org/react';
import { HomepageMappingItem, HomepageMappingItems } from '../../../pages/api/homepage_items';
import ItemIcon from '../ItemIcon/ItemIcon';
import { formatDistanceToNowStrict, fromUnixTime } from 'date-fns';
import Link from 'next/link';
import { TaxCell } from './Cells/Tax';
import ItemsPerPageDropdown from './ItemsPerPageDropdown';
import TablePagination from './Pagination';

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

const distanceToNowFromUnixTime = (unixTime: number | null | undefined) => {
  if (!unixTime) return null;
  return formatDistanceToNowStrict(fromUnixTime(unixTime));
};

const columnHelper = createColumnHelper<TableCompleteItem>();

const defaultColumns = [
  columnHelper.accessor('icon', {
    header: 'Icon',
    cell: info => <ItemIcon icon={info.getValue()} name={info.row.original.name} />,
    maxSize: 0,
  }),
  // columnHelper.accessor('id', { cell: info => info.getValue() }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => <Link href={`/item/${info.row.original.id}`}>{info.getValue()}</Link>,
    enableColumnFilter: true,
  }),
  columnHelper.accessor('dailyVolume', { header: 'Daily Volume', cell: info => info.getValue()?.toLocaleString() }),
  columnHelper.accessor('limit', { header: 'Limit', cell: info => info.getValue()?.toLocaleString() }),
  columnHelper.accessor('instaBuyPrice', {
    header: 'Instabuy',
    cell: info => info.getValue()?.toLocaleString(),
  }),
  columnHelper.accessor('instaSellPrice', { header: 'Instasell', cell: info => info.getValue()?.toLocaleString() }),
  columnHelper.accessor('roi', { header: 'ROI', cell: info => `${info.getValue()?.toFixed(1)}%` }),
  // columnHelper.accessor('value', { header: 'Value', cell: info => info.getValue().toLocaleString() }),
  // columnHelper.accessor('lowalch', { header: 'Low Alch', cell: info => info.getValue().toLocaleString() }),
  // columnHelper.accessor('highalch', { header: 'High Alch', cell: info => info.getValue().toLocaleString() }),
  // columnHelper.accessor('members', { header: 'Members', cell: info => info.getValue() }),
  columnHelper.accessor('instaBuyTime', { cell: info => distanceToNowFromUnixTime(info.getValue()) }),
  columnHelper.accessor('instaSellTime', { cell: info => distanceToNowFromUnixTime(info.getValue()) }),
  columnHelper.accessor('tax', { cell: info => <TaxCell tax={info.getValue()} /> }),
];

const ItemTable = () => {
  const { isDark } = useNextUiTheme();
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

  const completeItems = useMemo(
    () =>
      itemMappings?.map(item => {
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
          instaBuyPrice: instaBuyPrice,
          instaBuyTime: latestPrices?.data[item.id]?.highTime,
          instaSellPrice: instaSellPrice,
          instaSellTime: latestPrices?.data[item.id]?.lowTime,
          dailyVolume: dailyVolumes?.data[item.id],
          tax: calculateTax(latestPrices?.data[item.id]?.high),
          roi: calculateROI(instaBuyPrice, instaSellPrice),
          potentialProfit: 0,
        };
      }),
    [itemMappings, dailyVolumes, latestPrices],
  );

  const table = useReactTable({
    data: completeItems?.length ? completeItems : [],
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  // console.log('latest', latestPrices);
  // console.log('volume', dailyVolumes);
  // console.log('mapping', itemMappings);
  console.log(completeItems);
  // const reactTable = useReactTable({data: data})
  return (
    <>
      <Container display="flex" justify="flex-end" fluid responsive={false}>
        <ItemsPerPageDropdown table={table} />
      </Container>
      <Table
        shadow={false}
        role="table"
        aria-label="Price information for all items tradeable on the OSRS grand exchange"
      >
        <Table.Header>
          {table.getHeaderGroups()[0].headers.map(header => (
            <Table.Column key={header.id}>
              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
            </Table.Column>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.map(row => (
            <Table.Row
              key={row.id}
              css={{
                '&:nth-child(odd)': { backgroundColor: '$cyan100' },
                '&:nth-child(even)': { backgroundColor: '$cyan50' },
                '&:hover': { filter: isDark ? 'brightness(110%)' : 'brightness(97%)' },
              }}
            >
              {row.getVisibleCells().map(cell => (
                <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Container display="flex" justify="center">
        <TablePagination data={completeItems} table={table} />
      </Container>
    </>
  );
};

export default ItemTable;
