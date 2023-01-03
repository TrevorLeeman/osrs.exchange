import { Header, flexRender } from '@tanstack/react-table';
import { useIsClient } from 'usehooks-ts';

import { SortHandler, useItemTableContext } from '../../hooks/useItemTableContext';
import { sortDescNext } from '../../util/calculations';
import FilterIcon from '../Icons/Filter';
import SortIcon from '../Icons/Sort';
import SortAscIcon from '../Icons/SortAsc';
import SortDescIcon from '../Icons/SortDesc';
import { TableItem } from './ItemTableProvider';

type SortIconProps = {
  header: Header<TableItem, unknown>;
};

type TableHeaderProps = {
  header: Header<TableItem, unknown>;
};

export const ItemTable = () => {
  const isClient = useIsClient();

  return isClient ? (
    <div className="overflow-x-auto">
      <table
        role="table"
        aria-label="Price information for all items tradeable on the OSRS grand exchange"
        className="w-full border-separate border-spacing-0 font-plex-sans text-sm leading-4 sm:text-base"
      >
        <TableHead />
        <TableBody />
      </table>
    </div>
  ) : null;
};

const TableHead = () => {
  const { table } = useItemTableContext();

  return (
    <thead className="select-none text-left">
      <tr>
        {table.getHeaderGroups()[0].headers.map(header => (
          <TableHeader key={header.id} header={header} />
        ))}
      </tr>
    </thead>
  );
};

const TableHeader = ({ header }: TableHeaderProps) => {
  const { setSortOptions } = useItemTableContext();
  const sortableClasses = header.column.columnDef.enableSorting
    ? 'transition-all duration-75 hover:bg-slate-400/70 dark:hover:bg-slate-600'
    : '';
  const activelySortedClasses = header.column.getIsSorted() ? 'text-indigo-600 dark:text-yellow-400' : '';
  const buttonClasses = header.column.columnDef.enableSorting ? '' : 'cursor-default';

  const sortHandler: SortHandler = ({ header }) => {
    if (!header.column.columnDef.enableSorting) return;
    setSortOptions([
      { id: header.column.id, desc: sortDescNext({ currentSortDirection: header.column.getIsSorted() }) },
    ]);
  };

  return (
    <th
      className={`border-b-2 border-indigo-600 bg-slate-300 first:rounded-tl-xl last:rounded-tr-xl dark:border-yellow-400 dark:bg-slate-700 ${sortableClasses} ${activelySortedClasses}`}
    >
      <button
        onClick={e => sortHandler({ header })}
        className={`flex h-14 w-full items-center gap-2 whitespace-nowrap px-3 ${buttonClasses}`}
        tabIndex={header.column.columnDef.enableSorting ? 0 : -1}
      >
        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
        <div className="shrink-0">
          <SortIconDisplay header={header} />
          {header.column.getIsFiltered() ? <FilterIcon className="h-4 w-4" /> : null}
        </div>
      </button>
    </th>
  );
};

const TableBody = () => {
  const { table } = useItemTableContext();

  return (
    <tbody className="tracking-tight">
      {table.getRowModel().rows.map(row => (
        <tr
          key={row.id}
          className="h-12 transition-all duration-75 odd:bg-slate-200 even:bg-slate-100 hover:bg-slate-300 dark:odd:bg-slate-700/60 dark:even:bg-slate-700 dark:hover:bg-slate-600 [&:last-child_td:first-of-type]:rounded-bl-xl [&:last-child_td:last-of-type]:rounded-br-xl"
        >
          {row.getVisibleCells().map(cell => (
            <td key={cell.id} className="px-3">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

const SortIconDisplay = ({ header }: SortIconProps) => {
  const sortDirection = header.column.getIsSorted();

  if (!sortDirection && header.column.columnDef.enableSorting) return <SortIcon />;
  if (header.column.columnDef.enableSorting) {
    switch (sortDirection) {
      case 'asc':
        return <SortAscIcon />;
      case 'desc':
        return <SortDescIcon />;
    }
  }
  return null;
};
