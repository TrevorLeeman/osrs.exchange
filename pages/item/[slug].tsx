import { useMemo } from 'react';

import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Collapse, Loading, Spacer } from '@nextui-org/react';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { ParsedUrlQuery } from 'querystring';

import NotFound from '../../src/components/404/NotFound';
import BackArrowIcon from '../../src/components/Icons/BackArrow';
import ItemIcon from '../../src/components/ItemIcon/ItemIcon';
import ItemInfo from '../../src/components/ItemInfo/ItemInfo';
import PriceChartProvider from '../../src/components/PriceChart/PriceChartProvider';
import TimeIntervalButtonGroup from '../../src/components/PriceChart/TimeIntervalOptions';
import knex from '../../src/db/db';
import type { BasicItem } from '../../src/db/items';
import { WikiApiMappingItem } from '../../src/db/seeds/osrs_wiki_api_mapping';
import useTailwindMinBreakpoint from '../../src/hooks/useTailwindBreakpoint';

const DynamicPriceChart = dynamic(() => import('../../src/components/PriceChart/PriceChart'), {
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
  const title = useMemo(() => `OSRS Exchange | ${item?.name}`, [item?.name]);
  const isMaxMobile = !useTailwindMinBreakpoint('xs');

  if (itemIsLoading) return <Loading />;

  return item ? (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="mb-3">
        <PriceChartProvider>
          <div className="col grid grid-cols-[min-content_auto] gap-y-1 gap-x-3 sm:grid-rows-[auto_auto_minmax(0,1fr)] sm:gap-y-3">
            <div>
              <button onClick={() => router.back()} title="Go back">
                <BackArrowIcon width={isMaxMobile ? 36 : 48} height={isMaxMobile ? 36 : 48} />
              </button>
            </div>
            <div className="col-start-2 col-end-4 flex items-center gap-6">
              <h1 className="text-3xl font-bold xs:text-4xl sm:text-5xl">{item.name}</h1>
              <ItemIcon icon={item.icon} name={item.name} shadow={true} className="scale-125 sm:scale-150" />
            </div>
            <div className="col-start-2 col-end-4">
              <span className="text-gray-500">Live Grand Exchange pricing information for {item.name}</span>
            </div>

            <div className="col-start-2 my-3">
              <TimeIntervalButtonGroup />
            </div>
          </div>
          <DynamicPriceChart id={item.id} />
        </PriceChartProvider>
      </div>
      <Collapse.Group accordion={false} shadow>
        <Collapse title="Item Info" className="select-none">
          <ItemInfo item={item} />
        </Collapse>
      </Collapse.Group>
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
