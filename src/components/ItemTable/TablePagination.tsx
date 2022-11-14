import { Pagination } from '@nextui-org/react';

import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
import { useItemTableContext } from './ItemTableProvider';

const TablePagination = () => {
  const { items, table, setPageIndex } = useItemTableContext();
  const isMobile = !useTailwindMinBreakpoint('xs');

  return (
    <Pagination
      total={Math.ceil((items?.length ?? 0) / table.getState().pagination.pageSize)}
      onChange={pageIndex => setPageIndex(pageIndex - 1)}
      page={table.getState().pagination.pageIndex + 1}
      siblings={isMobile ? 0 : 1}
      noMargin={isMobile}
      size={isMobile ? 'md' : 'lg'}
    />
  );
};

export default TablePagination;
