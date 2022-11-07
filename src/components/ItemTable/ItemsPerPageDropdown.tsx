import { Key, useCallback } from 'react';

import { Dropdown } from '@nextui-org/react';
import { useIsMounted } from 'usehooks-ts';

import { useItemTableContext } from './ItemTableProvider';

const ItemsPerPageDropdown = ({ sizes = [10, 15, 20, 25, 50] }: { sizes?: number[] }) => {
  const isMounted = useIsMounted();
  const { table, setPageSize } = useItemTableContext();

  const changeHandler = useCallback((pageSize: Key) => {
    setPageSize(Number(pageSize));
  }, []);

  return isMounted() ? (
    <Dropdown>
      <Dropdown.Button>Show {table.getState().pagination.pageSize} Items</Dropdown.Button>
      <Dropdown.Menu onAction={changeHandler} selectedKeys={[table.getState().pagination.pageSize.toString()]}>
        {sizes.map(pageSize => (
          <Dropdown.Item key={pageSize.toString()}>{pageSize.toString()}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  ) : null;
};

export default ItemsPerPageDropdown;
