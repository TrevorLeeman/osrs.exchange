import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { StringKeyOf } from 'type-fest';

import { TableItem } from '../components/ItemTable/ItemTableProvider';

export type TableItemKeys<T> = { [key in StringKeyOf<TableItem>]: T };
export type ColumnOrder = Array<keyof TableItem>;

export type Preset = {
  columnVisibility: TableItemKeys<boolean>;
  columnOrder: ColumnOrder;
  sortOptions: SortingState;
  filterOptions: ColumnFiltersState;
};
type PresetIds = 'default' | 'highAlchProfit';
type Presets = {
  [key in PresetIds]: Preset;
};

type ColumnReducer = (args: { arr: Preset['columnOrder']; visible: boolean }) => TableItemKeys<boolean>;

type CreatePreset = (args: {
  orderedColumns: Preset['columnOrder'];
  sortOptions?: Preset['sortOptions'];
  filterOptions?: Preset['filterOptions'];
}) => Preset;

export const COLUMN_HEADERS = {
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
  instaBuyTime: 'Latest Instabuy',
  instaSellPrice: 'Buy Price',
  instaSellTime: 'Latest Instasell',
  dailyVolume: 'Daily Volume',
  margin: 'Margin',
  tax: 'Tax',
  roi: 'ROI',
  profit: 'Profit',
  potentialProfit: 'Potential Profit',
} as TableItemKeys<string>;

const columnReducer: ColumnReducer = ({ arr, visible }) => {
  return arr.reduce((acc, key) => {
    acc[key as StringKeyOf<TableItem>] = visible;
    return acc;
  }, {} as TableItemKeys<boolean>);
};

const createPreset: CreatePreset = ({ orderedColumns, sortOptions, filterOptions }) => {
  const hideAllColumns = columnReducer({ arr: Object.keys(COLUMN_HEADERS) as ColumnOrder, visible: false });
  const visibleColumns = columnReducer({ arr: orderedColumns, visible: true });

  return {
    columnVisibility: {
      ...hideAllColumns,
      ...visibleColumns,
    },
    columnOrder: orderedColumns,
    sortOptions: sortOptions ?? [],
    filterOptions: filterOptions ?? [],
  };
};

export const itemTablePresets: Presets = {
  default: createPreset({
    orderedColumns: [
      'icon',
      'name',
      'instaSellPrice',
      'instaBuyPrice',
      'profit',
      'dailyVolume',
      'limit',
      'roi',
      'potentialProfit',
      'instaBuyTime',
      'instaSellTime',
    ],
    sortOptions: [{ id: 'profit', desc: true }],
  }),

  highAlchProfit: createPreset({
    orderedColumns: [
      'icon',
      'name',
      'highAlchProfit',
      'instaSellPrice',
      'highAlch',
      'dailyVolume',
      'limit',
      'instaSellTime',
    ],
    sortOptions: [{ id: 'highAlchProfit', desc: true }],
  }),
};
