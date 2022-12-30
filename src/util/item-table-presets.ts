import { SortingState } from '@tanstack/react-table';
import { StringKeyOf } from 'type-fest';

import { TableItem } from '../components/ItemTable/ItemTableProvider';
import { ItemTableColumnFiltersState } from '../hooks/useItemTableContext';

export type TableItemKeys<T> = { [key in StringKeyOf<TableItem>]: T };
export type ColumnOrder = Array<keyof TableItem>;

export type Preset = {
  label: string;
  columnVisibility: TableItemKeys<boolean>;
  columnOrder: ColumnOrder;
  sortOptions: SortingState;
  columnFilters: ItemTableColumnFiltersState;
};
export type PresetIds = 'profit' | 'profitMinVolume' | 'highAlchProfit' | 'highVolume';
type Presets = {
  [key in PresetIds]: Preset;
};

type ColumnReducer = (args: { arr: Preset['columnOrder']; visible: boolean }) => TableItemKeys<boolean>;

type CreatePreset = (args: {
  label: string;
  orderedColumns: Preset['columnOrder'];
  sortOptions?: Preset['sortOptions'];
  columnFilters?: Preset['columnFilters'];
}) => Preset;

export const COLUMN_PROPERTIES = {
  id: {
    header: 'ID',
  },
  name: {
    header: 'Name',
  },
  limit: {
    header: 'Limit',
  },
  icon: {
    header: 'Icon',
  },
  value: {
    header: 'Value',
  },
  lowAlch: {
    header: 'Low Alch',
  },
  lowAlchProfit: {
    header: 'Low Alch Profit',
  },
  highAlch: {
    header: 'High Alch',
  },
  highAlchProfit: {
    header: 'High Alch Profit',
  },
  members: {
    header: 'Members',
  },
  instaBuyPrice: {
    header: 'Sell Price',
  },
  instaBuyTime: {
    header: 'Latest Sell',
  },
  instaSellPrice: {
    header: 'Buy Price',
  },
  instaSellTime: {
    header: 'Latest Buy',
  },
  dailyVolume: {
    header: 'Daily Volume',
  },
  margin: {
    header: 'Margin',
  },
  tax: {
    header: 'Tax',
  },
  roi: {
    header: 'ROI',
  },
  profit: {
    header: 'Profit',
  },
  potentialProfit: {
    header: 'Potential Profit',
  },
} as TableItemKeys<{ header: string }>;

export const COLUMN_IDS = Object.keys(COLUMN_PROPERTIES) as ColumnOrder;

const columnReducer: ColumnReducer = ({ arr, visible }) => {
  return arr.reduce((acc, key) => {
    acc[key as StringKeyOf<TableItem>] = visible;
    return acc;
  }, {} as TableItemKeys<boolean>);
};

const createPreset: CreatePreset = ({ label, orderedColumns, sortOptions, columnFilters }) => {
  const hideAllColumns = columnReducer({ arr: COLUMN_IDS, visible: false });
  const visibleColumns = columnReducer({ arr: orderedColumns, visible: true });

  return {
    label,
    columnVisibility: {
      ...hideAllColumns,
      ...visibleColumns,
    },
    columnOrder: orderedColumns,
    sortOptions: sortOptions ?? [],
    columnFilters: columnFilters ?? [],
  };
};

export const itemTablePresets: Presets = {
  profit: createPreset({
    label: 'Profit - All Items',
    orderedColumns: [
      'icon',
      'name',
      'instaSellPrice',
      'instaBuyPrice',
      'profit',
      'roi',
      'dailyVolume',
      'limit',
      'potentialProfit',
      'instaSellTime',
      'instaBuyTime',
    ],
    sortOptions: [{ id: 'profit', desc: true }],
  }),

  profitMinVolume: createPreset({
    label: 'Profit w/ Min Volume',
    orderedColumns: [
      'icon',
      'name',
      'instaSellPrice',
      'instaBuyPrice',
      'profit',
      'roi',
      'dailyVolume',
      'limit',
      'potentialProfit',
      'instaSellTime',
      'instaBuyTime',
    ],
    sortOptions: [{ id: 'profit', desc: true }],
    columnFilters: [{ id: 'dailyVolume', value: [10, null] }],
  }),

  highAlchProfit: createPreset({
    label: 'High Alch Profit',
    orderedColumns: [
      'icon',
      'name',
      'instaSellPrice',
      'highAlch',
      'highAlchProfit',
      'dailyVolume',
      'limit',
      'instaSellTime',
    ],
    sortOptions: [{ id: 'highAlchProfit', desc: true }],
  }),

  highVolume: createPreset({
    label: 'High Volume Profit',
    orderedColumns: [
      'icon',
      'name',
      'instaSellPrice',
      'instaBuyPrice',
      'profit',
      'roi',
      'dailyVolume',
      'limit',
      'potentialProfit',
      'instaSellTime',
      'instaBuyTime',
    ],
    sortOptions: [{ id: 'profit', desc: true }],
    columnFilters: [{ id: 'dailyVolume', value: [10_000, null] }],
  }),
};
