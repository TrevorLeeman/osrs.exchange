import { Pagination } from '@nextui-org/react';

import { useItemTableContext } from './ItemTableProvider';

const TablePagination = () => {
  const { items, table, setPageIndex } = useItemTableContext();

  return (
    <Pagination
      total={Math.ceil((items?.length ?? 0) / table.getState().pagination.pageSize) - 1}
      onChange={pageIndex => setPageIndex(pageIndex - 1)}
      page={table.getState().pagination.pageIndex + 1}
    />
  );
};

export default TablePagination;
