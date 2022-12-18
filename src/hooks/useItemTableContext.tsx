import { Dispatch, SetStateAction, createContext, useContext } from 'react';

import { Table } from '@tanstack/react-table';

import { ColumnVisibility, SortHandler, TableItem } from '../components/ItemTable/ItemTableProvider';

export type ItemTableContextType = {
  items: TableItem[];
  table: Table<TableItem>;
  tableDataReady: boolean;
  setPageIndex: (state: number) => void;
  setPageSize: Dispatch<SetStateAction<number>>;
  sortHandler: SortHandler;
  setColumnVisibility: Dispatch<SetStateAction<ColumnVisibility>>;
};

export const ItemTableContext = createContext<ItemTableContextType>(undefined!);

export const useItemTableContext = () => {
  const context = useContext(ItemTableContext);

  if (context === undefined) {
    throw new Error('useItemTableContext must be used within an ItemTableProvider');
  }

  return context;
};
