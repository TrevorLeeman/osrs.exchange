import type { GetServerSideProps, NextPage } from 'next';
import type { BasicItem } from '../../src/db/items';
import React from 'react';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { ParsedUrlQuery } from 'querystring';
import { Collapse, Container, Loading, Spacer, Text } from '@nextui-org/react';
import knex from '../../src/db/db';
import ItemInfo from '../../src/components/ItemInfo/ItemInfo';

import dynamic from 'next/dynamic';
import { WikiApiMappingItem } from '../../src/db/seeds/osrs_wiki_api_mapping';
import NotFound from '../../src/components/404/NotFound';

const DynamicGrandExchangeCard = dynamic(() => import('../../src/components/GrandExchangeCard/GrandExchangeCard'), {
  ssr: false,
});

interface Params extends ParsedUrlQuery {
  slug: [string];
}

export interface RealTimePrices {
  data: [Price];
}

export interface Price {
  avgHighPrice: number;
  avgLowPrice: number;
  highPriceVolume: number;
  lowPriceVolumne: number;
  timestamp: number;
}

export const ITEM_PAGE_QUERIES = {
  realTimePrices: 'real_time_prices',
  longTermPrices: 'long_term_prices',
  itemById: 'item_by_id',
};

const ItemPage: NextPage = ({ dehydratedState }: any) => {
  const {
    data: itemData,
    isLoading: itemIsLoading,
    isFetching: itemIsFetching,
  } = useQuery<BasicItem[]>([ITEM_PAGE_QUERIES.itemById]);
  const item = itemData ? itemData[0] : null;

  if (itemIsLoading) return <Loading />;

  return item ? (
    <Container fluid>
      <Text h1>{item.name}</Text>
      <Spacer y={1} />
      <DynamicGrandExchangeCard item={item} />
      <Spacer y={2} />
      <Collapse.Group accordion={false} shadow>
        <Collapse title="Item Info" css={{ userSelect: 'none' }}>
          <ItemInfo item={item} />
        </Collapse>
      </Collapse.Group>
      <Spacer y={1} />
    </Container>
  ) : (
    <NotFound />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug } = context.params as Params;
  const itemId = parseInt(slug[slug.length - 1], 10);
  const queryClient = new QueryClient();

  if (itemId !== NaN) {
    await queryClient.prefetchQuery(
      [ITEM_PAGE_QUERIES.itemById],
      async () =>
        await knex
          .select(
            'im.id',
            'im.name',
            'im.limit',
            knex.raw('CASE WHEN i.icon IS NOT NULL THEN i.icon ELSE im.icon END'),
            'im.value',
            'im.lowalch',
            'im.highalch',
            'im.examine',
            'i.weight',
            'i.release_date',
            'i.wiki_url',
          )
          .from<WikiApiMappingItem>({ im: 'item_mapping' })
          .leftJoin({ i: 'item' }, 'i.id', 'im.id')
          .where(knex.raw('im.id = ?', itemId)),
    );
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default ItemPage;