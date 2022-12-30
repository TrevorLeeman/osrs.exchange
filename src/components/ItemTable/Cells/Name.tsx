import { CellContext } from '@tanstack/react-table';

import LinkThemed from '../../Common/LinkThemed';
import { TableItem } from '../ItemTableProvider';

type NameCellProps = {
  context: CellContext<TableItem, string>;
};

const NameCell = ({ context }: NameCellProps) => (
  <div className="whitespace-nowrap text-left">
    <LinkThemed href={`/item/${context.row.original.id}`}>{context.getValue()}</LinkThemed>
  </div>
);

export default NameCell;
