import { CellContext } from '@tanstack/react-table';

import { TableCompleteItem } from '../ItemTableProvider';

type TaxCellProps = {
  context: CellContext<TableCompleteItem, number | null | undefined>;
};

const TaxCell = ({ context }: TaxCellProps) => {
  const tax = context.getValue();

  if (tax === 0) return <>Free</>;
  if (!tax) return null;
  return <>{tax?.toLocaleString()}</>;
};

export default TaxCell;
