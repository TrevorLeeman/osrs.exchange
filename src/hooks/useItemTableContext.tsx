import { Dispatch, SetStateAction, createContext, useContext } from 'react';

import { Header, SortingState, Table } from '@tanstack/react-table';

import { TableItem } from '../components/ItemTable/ItemTableProvider';
import { ColumnOrder, TableItemKeys } from '../util/item-table-presets';

export type SortHandler = (params: { header: Header<TableItem, unknown> }) => void;

type ItemTableColumnFilter = {
  id: keyof TableItem;
  value: unknown;
};
export type ItemTableColumnFiltersState = ItemTableColumnFilter[];

export type ItemTableContextType = {
  items: TableItem[];
  table: Table<TableItem>;
  tableDataReady: boolean;
  setPageIndex: (state: number) => void;
  setPageSize: Dispatch<SetStateAction<number>>;
  setSortOptions: Dispatch<SetStateAction<SortingState>>;
  setColumnVisibility: Dispatch<SetStateAction<TableItemKeys<boolean>>>;
  setColumnOrder: Dispatch<SetStateAction<ColumnOrder | undefined>>;
  setColumnFilters: Dispatch<SetStateAction<ItemTableColumnFiltersState>>;
};

export const ItemTableContext = createContext<ItemTableContextType>(undefined!);

export const useItemTableContext = () => {
  const context = useContext(ItemTableContext);

  if (context === undefined) {
    throw new Error('useItemTableContext must be used within an ItemTableProvider');
  }

  return context;
};
