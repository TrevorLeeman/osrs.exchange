import { Pagination } from '@nextui-org/react';
import { useIsClient } from 'usehooks-ts';

import { useItemTableContext } from '../../hooks/useItemTableContext';
import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';

const TablePagination = () => {
  const isClient = useIsClient();
  const { table, setPageIndex } = useItemTableContext();
  const isMaxTablet = !useTailwindMinBreakpoint('xl');

  return isClient ? (
    <Pagination
      total={table.getPageCount()}
      onChange={pageIndex => setPageIndex(pageIndex - 1)}
      page={table.getState().pagination.pageIndex + 1}
      siblings={isMaxTablet ? 0 : 1}
      noMargin={isMaxTablet}
      size={isMaxTablet ? 'md' : 'lg'}
    />
  ) : null;
};

export default TablePagination;
