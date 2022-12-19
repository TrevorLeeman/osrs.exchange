import { Dispatch, SetStateAction, createContext, useContext } from 'react';

import { Header, SortingState, Table, VisibilityState } from '@tanstack/react-table';

import { TableItem } from '../components/ItemTable/ItemTableProvider';

export type SortHandler = (params: { header: Header<TableItem, unknown> }) => void;

export type ItemTableContextType = {
  items: TableItem[];
  table: Table<TableItem>;
  tableDataReady: boolean;
  setPageIndex: (state: number) => void;
  setPageSize: Dispatch<SetStateAction<number>>;
  setSortOptions: Dispatch<SetStateAction<SortingState>>;
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>;
};

export const ItemTableContext = createContext<ItemTableContextType>(undefined!);

export const useItemTableContext = () => {
  const context = useContext(ItemTableContext);

  if (context === undefined) {
    throw new Error('useItemTableContext must be used within an ItemTableProvider');
  }

  return context;
};
