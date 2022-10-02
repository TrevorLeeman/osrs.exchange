import { Pagination } from '@nextui-org/react';
import type { Table } from '@tanstack/react-table';

const TablePagination = ({ data, table }: { data: any[] | undefined; table: Table<any> }) => (
  <Pagination
    total={Math.ceil((data?.length ?? 0) / table.getState().pagination.pageSize) - 1}
    onChange={pageNum => table.setPageIndex(pageNum - 1)}
    page={table.getState().pagination.pageIndex + 1}
  />
);

export default TablePagination;
