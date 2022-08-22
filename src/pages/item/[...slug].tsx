import type { GetServerSideProps, NextApiRequest, NextPage } from 'next';
import ItemIcon from '../../components/ItemIcon/ItemIcon';
import React from 'react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import knex from '../../db/db';
import { BasicItem } from '../../db/items';
import { ParsedUrlQuery } from 'querystring';
import { Collapse, Container, Loading } from '@nextui-org/react';
import ItemInfo from '../../components/ItemInfo/ItemInfo';

interface Params extends ParsedUrlQuery {
  slug: [string];
}

const ItemPage: NextPage = ({ dehydratedState }: any) => {
  const { data, isLoading, isFetching } = useQuery<BasicItem[]>('getItem');
  const item = data ? data[0] : null;
  console.log(data);
  if (isLoading) return <Loading />;

  return (
    <Container fluid>
      <Collapse.Group accordion={false} shadow>
        <Collapse
          title="Grand Exchange"
          contentLeft={<ItemIcon item={item} width={40} height={40} />}
          subtitle={`Pricing information for ${item?.name}`}
          disabled={item?.tradeable_on_ge === false}
        >
          GE data here...
        </Collapse>
        <Collapse title="Item Info" expanded>
          <ItemInfo item={item} />
        </Collapse>
      </Collapse.Group>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug } = context.params as Params;
  const itemId = slug[slug.length - 1];
  const queryClient = new QueryClient();

  if (parseInt(itemId, 10) !== NaN) {
    await queryClient.prefetchQuery(
      'getItem',
      async () => await knex.select().from<BasicItem>('item').where(knex.raw('id = ?', itemId)),
    );
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default ItemPage;
