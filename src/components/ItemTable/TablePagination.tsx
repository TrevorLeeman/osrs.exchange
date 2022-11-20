import { Pagination } from '@nextui-org/react';

import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
import { useItemTableContext } from './ItemTableProvider';

const TablePagination = () => {
  const { items, table, setPageIndex } = useItemTableContext();
  const isMaxMobile = !useTailwindMinBreakpoint('xs');

  return (
    <Pagination
      total={Math.ceil((items?.length ?? 0) / table.getState().pagination.pageSize)}
      onChange={pageIndex => setPageIndex(pageIndex - 1)}
      page={table.getState().pagination.pageIndex + 1}
      siblings={isMaxMobile ? 0 : 1}
      noMargin={isMaxMobile}
      size={isMaxMobile ? 'md' : 'lg'}
    />
  );
};

export default TablePagination;
