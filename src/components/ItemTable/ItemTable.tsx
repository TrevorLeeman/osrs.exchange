import { flexRender } from '@tanstack/react-table';
import { useIsClient } from 'usehooks-ts';

import SortIcon from '../Icons/Sort';
import { useItemTableContext } from './ItemTableProvider';

const ItemTable = () => {
  const { table } = useItemTableContext();
  const isClient = useIsClient();

  return isClient ? (
    <div className="overflow-x-auto">
      <table
        role="table"
        aria-label="Price information for all items tradeable on the OSRS grand exchange"
        className="w-full border-collapse bg-slate-300 dark:bg-slate-500"
      >
        <thead className="select-none">
          {table.getHeaderGroups()[0].headers.map(header => (
            <th
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              className={`h-16 px-3 ${
                header.column.columnDef.enableSorting
                  ? 'cursor-pointer transition-all duration-75 hover:bg-slate-400 dark:hover:bg-slate-600'
                  : ''
              }`}
            >
              <div>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                {/* {header.column.columnDef.enableSorting ? <SortIcon /> : null} */}
              </div>
            </th>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className="h-16 transition-all duration-75 odd:bg-cyan-200 even:bg-cyan-100 hover:bg-cyan-50 dark:odd:bg-cyan-800 dark:even:bg-cyan-900 dark:hover:bg-cyan-700 "
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-3 text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : null;
};

export default ItemTable;
