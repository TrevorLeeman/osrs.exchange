import { Dropdown } from '@nextui-org/react';
import type { Table } from '@tanstack/react-table';

const ItemsPerPageDropdown = ({ table }: { table: Table<any> }) => (
  <Dropdown>
    <Dropdown.Button>Show {table.getState().pagination.pageSize} Items</Dropdown.Button>
    <Dropdown.Menu onAction={pageSize => table.setPageSize(Number(pageSize))}>
      {[10, 20, 30, 40, 50].map(pageSize => (
        <Dropdown.Item key={pageSize}>{pageSize}</Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

export default ItemsPerPageDropdown;
