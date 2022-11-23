import { flexRender } from '@tanstack/react-table';
import { useIsClient } from 'usehooks-ts';

import SortIcon from '../Icons/Sort';
import { useItemTableContext } from './ItemTableProvider';

const ItemTable = () => {
  const isClient = useIsClient();

  return isClient ? (
    <div className="overflow-x-auto">
      <table
        role="table"
        aria-label="Price information for all items tradeable on the OSRS grand exchange"
        className=" w-full border-separate border-spacing-0  rounded-xl  font-plex-sans text-sm font-medium  sm:text-base"
      >
        <TableHead />
        <TableBody />
      </table>
    </div>
  ) : null;
};

const TableHead = () => {
  const { table, sortHandler } = useItemTableContext();

  return (
    <thead className="select-none text-left">
      <tr>
        {table.getHeaderGroups()[0].headers.map(header => (
          <th
            key={header.id}
            onClick={e => sortHandler({ header })}
            className={`sticky top-0 z-10 h-16 border-b-2 border-indigo-600 bg-slate-300 px-3 first:rounded-tl-xl last:rounded-tr-xl dark:border-yellow-400 dark:bg-slate-500 ${
              header.column.columnDef.enableSorting
                ? 'cursor-pointer transition-all duration-75 hover:bg-slate-400/80 dark:hover:bg-slate-600'
                : ''
            }`}
          >
            <div className="flex">
              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              {header.column.columnDef.enableSorting ? <SortIcon /> : null}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableBody = () => {
  const { table } = useItemTableContext();

  return (
    <tbody className="tracking-tight">
      {table.getRowModel().rows.map(row => (
        <tr
          key={row.id}
          className="h-16 transition-all duration-75 odd:bg-slate-200 even:bg-slate-100 hover:bg-slate-300 dark:odd:bg-cyan-800 dark:even:bg-cyan-900 dark:hover:bg-cyan-700 [&:last-child_:first-child]:rounded-bl-xl [&:last-child_:last-child]:rounded-br-xl"
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

export default ItemTable;
