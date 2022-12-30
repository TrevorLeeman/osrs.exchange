import { Pagination } from '@nextui-org/react';

import { useItemTableContext } from '../../hooks/useItemTableContext';
import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';

const TablePagination = () => {
  const { table, setPageIndex } = useItemTableContext();
  const isMaxTablet = !useTailwindMinBreakpoint('sm');

  return (
    <Pagination
      total={table.getPageCount()}
      onChange={pageIndex => setPageIndex(pageIndex - 1)}
      page={table.getState().pagination.pageIndex + 1}
      siblings={isMaxTablet ? 0 : 1}
      noMargin={isMaxTablet}
      size={isMaxTablet ? 'md' : 'lg'}
    />
  );
};

export default TablePagination;
