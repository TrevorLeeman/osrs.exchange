import { Table } from '@nextui-org/react';
import { format } from 'date-fns';
import { BasicItem } from '../../db/items';

const ItemInfo = ({ item }: { item: BasicItem | null }) =>
  item ? (
    <Table sticked lined striped bordered shadow={false} selectionMode="none" aria-label="Item Info">
      <Table.Header>
        <Table.Column>Property</Table.Column>
        <Table.Column>Value</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row key="1">
          <Table.Cell>ID</Table.Cell>
          <Table.Cell>{item.id}</Table.Cell>
        </Table.Row>
        <Table.Row key="2">
          <Table.Cell>Name</Table.Cell>
          <Table.Cell>{item.name}</Table.Cell>
        </Table.Row>
        <Table.Row key="3">
          <Table.Cell>High Alch</Table.Cell>
          <Table.Cell>{item.highalch}</Table.Cell>
        </Table.Row>
        <Table.Row key="4">
          <Table.Cell>Low Alch</Table.Cell>
          <Table.Cell>{item.lowalch}</Table.Cell>
        </Table.Row>
        <Table.Row key="5">
          <Table.Cell>Weight</Table.Cell>
          <Table.Cell>{item.weight}</Table.Cell>
        </Table.Row>
        <Table.Row key="6">
          <Table.Cell>Examine</Table.Cell>
          <Table.Cell>{item.examine}</Table.Cell>
        </Table.Row>
        <Table.Row key="7">
          <Table.Cell>Release Date</Table.Cell>
          <Table.Cell>
            {item.release_date ? format(new Date(item.release_date), 'MMMM do, u') : 'Unavailable'}
          </Table.Cell>
        </Table.Row>
        <Table.Row key="8">
          <Table.Cell>Wiki Link</Table.Cell>
          <Table.Cell>
            {item.wiki_url ? (
              <a href={item.wiki_url} target="_blank" rel="noreferrer">
                {item.wiki_url}
              </a>
            ) : (
              'Unavailable'
            )}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ) : null;

export default ItemInfo;
