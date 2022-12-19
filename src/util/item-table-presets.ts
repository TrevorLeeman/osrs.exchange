import { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table';

type Preset = {
  columnVisibility: VisibilityState;
  sortOptions: SortingState;
  filterOptions: ColumnFiltersState;
};

type Presets = {
  [key: string]: Preset;
};

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

const allColumnsHidden = Object.keys(COLUMN_HEADERS).reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {} as VisibilityState);

export const itemTablePresets: Presets = {
  default: {
    columnVisibility: {
      ...allColumnsHidden,
      icon: true,
      name: true,
      instaSellPrice: true,
      instaBuyPrice: true,
      profit: true,
      limit: true,
      potentialProfit: true,
      roi: true,
      dailyVolume: true,
      highAlch: true,
      highAlchProfit: true,
      instaSellTime: true,
      instaBuyTime: true,
    },
    sortOptions: [{ id: 'instaBuyPrice', desc: true }],
    filterOptions: [],
  },
  highAlchProfit: {
    columnVisibility: {
      ...allColumnsHidden,
      icon: true,
      name: true,
      instaSellPrice: true,
      limit: true,
      dailyVolume: true,
      highAlch: true,
      highAlchProfit: true,
      instaSellTime: true,
    },
    sortOptions: [{ id: 'highAlchProfit', desc: true }],
    filterOptions: [],
  },
};
