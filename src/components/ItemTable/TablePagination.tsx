import { Pagination } from '@nextui-org/react';

import { useItemTableContext } from './ItemTableProvider';

const TablePagination = () => {
  const { items, table, setPageIndex } = useItemTableContext();

  const changeHandler = (pageIndex: number) => {
    setPageIndex(pageIndex - 1);
  };

  return (
    <Pagination
      total={Math.ceil((items?.length ?? 0) / table.getState().pagination.pageSize) - 1}
      onChange={changeHandler}
      page={table.getState().pagination.pageIndex + 1}
    />
  );
};

export default TablePagination;
