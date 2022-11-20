import Link from 'next/link';

import { CellContext } from '@tanstack/react-table';

import { TableCompleteItem } from '../ItemTableProvider';

type NameCellProps = {
  context: CellContext<TableCompleteItem, string>;
};

const NameCell = ({ context }: NameCellProps) => (
  <div className="whitespace-nowrap text-left">
    <Link href={`/item/${context.row.original.id}`} className="text-blue-600 hover:underline dark:text-blue-300">
      {context.getValue()}
    </Link>
  </div>
);

export default NameCell;
