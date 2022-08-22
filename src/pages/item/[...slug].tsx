import type { GetServerSideProps, NextApiRequest, NextPage } from 'next';

import Image from 'next/image';
import ItemIcon from '../../components/ItemIcon/ItemIcon';
import React from 'react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import knex from '../../db/db';
import { BasicItem } from '../../db/items';

const ItemPage: NextPage = ({ dehydratedState }: any) => {
  const { data, isLoading, isFetching } = useQuery('getItem');
  console.log(data);

  return <div></div>;
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug } = context.query;
  const itemId = slug ? slug[slug.length - 1] : null;
  const queryClient = new QueryClient();

  if (itemId && parseInt(itemId, 10) !== NaN) {
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
