import { Dropdown } from '@nextui-org/react';
import type { Table } from '@tanstack/react-table';

const ItemsPerPageDropdown = ({ sizes = [10, 15, 20, 25], table }: { sizes?: number[]; table: Table<any> }) => (
  <Dropdown>
    <Dropdown.Button>Show {table.getState().pagination.pageSize} Items</Dropdown.Button>
    <Dropdown.Menu onAction={pageSize => table.setPageSize(Number(pageSize))}>
      {sizes.map(pageSize => (
        <Dropdown.Item key={pageSize}>{pageSize.toString()}</Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

export default ItemsPerPageDropdown;
