import React, { useMemo } from 'react';

import type { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Collapse, Container, Loading, Spacer, Text } from '@nextui-org/react';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { ParsedUrlQuery } from 'querystring';

import NotFound from '../../src/components/404/NotFound';
import BackArrowIcon from '../../src/components/Icons/BackArrow';
import ItemIcon from '../../src/components/ItemIcon/ItemIcon';
import ItemInfo from '../../src/components/ItemInfo/ItemInfo';
import knex from '../../src/db/db';
import type { BasicItem } from '../../src/db/items';
import { WikiApiMappingItem } from '../../src/db/seeds/osrs_wiki_api_mapping';

const DynamicGrandExchangeCard = dynamic(() => import('../../src/components/GrandExchangeCard/GrandExchangeCard'), {
  ssr: false,
});

interface Params extends ParsedUrlQuery {
  slug: [string];
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

  const router = useRouter();
  const item = itemData ? itemData[0] : null;
  const title = useMemo(() => `OSRS Prices | ${item?.name}`, [item?.name]);

  if (itemIsLoading) return <Loading />;

  return item ? (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Container fluid>
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            title="Go back"
            className="flex cursor-pointer items-center rounded border-0 bg-transparent"
          >
            <BackArrowIcon width={48} height={48} />
          </button>
          <Text h1 className="m-0">
            {item.name}
          </Text>
          <ItemIcon icon={item.icon} name={item.name} width={44} shadow={true} />
        </div>
        <Spacer y={1} />
        <DynamicGrandExchangeCard item={item} />
        <Spacer y={2} />
        <Collapse.Group accordion={false} shadow>
          <Collapse title="Item Info" className="select-none">
            <ItemInfo item={item} />
          </Collapse>
        </Collapse.Group>
        <Spacer y={1} />
      </Container>
    </>
  ) : (
    <NotFound />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug } = context.params as Params;
  const itemId = Array.isArray(slug) ? parseInt(slug[slug.length - 1], 10) : parseInt(slug, 10);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([ITEM_PAGE_QUERIES.itemById], async () => {
    if (isNaN(itemId)) return [];
    return await knex
      .select(
        'im.id',
        'im.name',
        'im.limit',
        'im.icon',
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
      .where(knex.raw('im.id = ?', itemId));
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

// export const getStaticProps: GetStaticProps = async context => {
//   const { slug } = context.params as Params;
//   const itemId = Array.isArray(slug) ? parseInt(slug[slug.length - 1], 10) : parseInt(slug, 10);
//   console.log('id', itemId);
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery([ITEM_PAGE_QUERIES.itemById], async () => {
//     if (isNaN(itemId)) return [];
//     return await knex
//       .select(
//         'im.id',
//         'im.name',
//         'im.limit',
//         knex.raw('CASE WHEN i.icon IS NOT NULL THEN i.icon ELSE im.icon END'),
//         'im.value',
//         'im.lowalch',
//         'im.highalch',
//         'im.examine',
//         'i.weight',
//         'i.release_date',
//         'i.wiki_url',
//       )
//       .from<WikiApiMappingItem>({ im: 'item_mapping' })
//       .leftJoin({ i: 'item' }, 'i.id', 'im.id')
//       .where(knex.raw('im.id = ?', itemId));
//   });

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// };

// export const getStaticPaths: GetStaticPaths = async context => {
//   const itemIds = await knex.select('id').from<WikiApiMappingItem>('item_mapping');

//   const paths = itemIds.map(item => ({
//     params: { slug: item.id.toString() },
//   }));

//   return { paths, fallback: false };
// };

export default ItemPage;
