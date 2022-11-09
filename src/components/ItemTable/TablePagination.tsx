import { Pagination } from '@nextui-org/react';

import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
import { useItemTableContext } from './ItemTableProvider';

const TablePagination = () => {
  const { items, table, setPageIndex } = useItemTableContext();
  const isMobileXs = !useTailwindMinBreakpoint('xs');

  return (
    <Pagination
      total={Math.ceil((items?.length ?? 0) / table.getState().pagination.pageSize) - 1}
      onChange={pageIndex => setPageIndex(pageIndex - 1)}
      page={table.getState().pagination.pageIndex + 1}
      siblings={isMobileXs ? 0 : 1}
      noMargin={isMobileXs}
    />
  );
};

export default TablePagination;
