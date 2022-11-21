import Link from 'next/link';

import { CellContext } from '@tanstack/react-table';

import LinkBlue from '../../Common/LinkBlue';
import { TableCompleteItem } from '../ItemTableProvider';

type NameCellProps = {
  context: CellContext<TableCompleteItem, string>;
};

const NameCell = ({ context }: NameCellProps) => (
  <div className="whitespace-nowrap text-left">
    <LinkBlue href={`/item/${context.row.original.id}`}>{context.getValue()}</LinkBlue>
  </div>
);

export default NameCell;
