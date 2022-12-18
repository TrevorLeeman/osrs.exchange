import { CellContext } from '@tanstack/react-table';

import LinkBlue from '../../Common/LinkBlue';
import { TableItem } from '../ItemTableProvider';

type NameCellProps = {
  context: CellContext<TableItem, string>;
};

const NameCell = ({ context }: NameCellProps) => (
  <div className="whitespace-nowrap text-left font-medium">
    <LinkBlue href={`/item/${context.row.original.id}`}>{context.getValue()}</LinkBlue>
  </div>
);

export default NameCell;
