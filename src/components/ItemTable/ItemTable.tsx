import { Container, Spacer, Table, useTheme as useNextUiTheme } from '@nextui-org/react';
import { flexRender } from '@tanstack/react-table';

import SortIcon from '../Icons/Sort';
import { useItemTableContext } from './ItemTableProvider';
import ItemsPerPageDropdown from './ItemsPerPageDropdown';
import ItemTablePagination from './TablePagination';

const ItemTable = () => {
  const { isDark } = useNextUiTheme();
  const { table, items } = useItemTableContext();

  return (
    <Container css={{ width: 'fit-content' }}>
      <Container display="flex" justify="flex-end" fluid responsive={false}>
        <ItemsPerPageDropdown table={table} />
      </Container>
      <Spacer y={0.5} />
      <Table
        // shadow={false}
        role="table"
        aria-label="Price information for all items tradeable on the OSRS grand exchange"
        css={{ backgroundColor: '$gray300', '@media only screen and (min-width: 1400px)': { minWidth: '1280px' } }}
      >
        <Table.Header>
          {table.getHeaderGroups()[0].headers.map(header => (
            <Table.Column key={header.id}>
              <div onClick={header.column.getToggleSortingHandler()}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                {header.column.columnDef.enableSorting ? <SortIcon /> : null}
              </div>
            </Table.Column>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.map(row => (
            <Table.Row
              key={row.id}
              css={{
                height: '60px',
                '&:nth-child(odd)': { backgroundColor: '$cyan100' },
                '&:nth-child(even)': { backgroundColor: '$cyan50' },
                '&:hover': { filter: isDark ? 'brightness(110%)' : 'brightness(97%)' },
              }}
            >
              {row.getVisibleCells().map(cell => (
                <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Spacer y={0.5} />
      <Container display="flex" justify="center">
        <ItemTablePagination data={items} table={table} />
      </Container>
      <Spacer y={1} />
    </Container>
  );
};

export default ItemTable;
