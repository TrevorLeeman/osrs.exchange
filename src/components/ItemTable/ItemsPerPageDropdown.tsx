import { Key, useCallback } from 'react';

import { Dropdown } from '@nextui-org/react';
import { useIsClient } from 'usehooks-ts';

import { useItemTableContext } from '../../hooks/useItemTableContext';

const ItemsPerPageDropdown = ({ sizes = [10, 15, 20, 25, 50] }: { sizes?: number[] }) => {
  const isClient = useIsClient();
  const { table, setPageSize } = useItemTableContext();

  const changeHandler = useCallback((pageSize: Key) => {
    setPageSize(Number(pageSize));
  }, []);

  return isClient ? (
    <Dropdown isBordered={'true'}>
      <Dropdown.Button className="min-h-[40px] bg-blue-600">
        Show {table.getState().pagination.pageSize} Items
      </Dropdown.Button>
      <Dropdown.Menu onAction={changeHandler} selectedKeys={[table.getState().pagination.pageSize.toString()]}>
        {sizes.map(pageSize => (
          <Dropdown.Item key={pageSize.toString()}>{pageSize.toString()}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  ) : null;
};

export default ItemsPerPageDropdown;
