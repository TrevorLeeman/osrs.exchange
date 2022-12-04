import { useMemo } from 'react';

import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { Loading } from '@nextui-org/react';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { ParsedUrlQuery } from 'querystring';

import NotFound from '../../src/components/404/NotFound';
import H1 from '../../src/components/Common/H1';
import PageDescription from '../../src/components/Common/PageDescription';
import ItemIcon from '../../src/components/ItemIcon/ItemIcon';
import { ItemInfoGridDisplay } from '../../src/components/ItemInfoGrid/ItemInfoGrid';
import { PriceChartProps } from '../../src/components/PriceChart/PriceChart';
import PriceChartProvider from '../../src/components/PriceChart/PriceChartProvider';
import knex from '../../src/db/db';
import type { BasicItem } from '../../src/db/items';
import { WikiApiMappingItem } from '../../src/db/seeds/osrs_wiki_api_mapping';

interface Params extends ParsedUrlQuery {
  slug: [string];
}

export interface ItemPageItem extends WikiApiMappingItem {
  weight: BasicItem['weight'];
  release_date: BasicItem['release_date'];
  wiki_url: BasicItem['wiki_url'];
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

const DynamicPriceChart = dynamic<PriceChartProps>(
  () => import('../../src/components/PriceChart/PriceChart').then(mod => mod.PriceChart),
  {
    ssr: false,
  },
);

const DynamicTimeIntervalOptions = dynamic(() => import('../../src/components/PriceChart/TimeIntervalOptions'), {
  ssr: false,
});

const ItemPage: NextPage = ({ dehydratedState }: any) => {
  const {
    data: itemData,
    isLoading: itemIsLoading,
    isFetching: itemIsFetching,
  } = useQuery<ItemPageItem[]>([ITEM_PAGE_QUERIES.itemById]);

  const item = itemData ? itemData[0] : null;
  const title = useMemo(() => `${item?.name} | OSRS Exchange`, [item?.name]);

  if (itemIsLoading)
    return (
      <div className="grid h-full place-items-center ">
        <Loading />
      </div>
    );

  return item ? (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="mb-3">
        <PriceChartProvider>
          <div className="flex flex-col gap-y-2 px-3">
            <div className="flex items-center gap-1.5 xs:gap-6">
              <H1>{item.name}</H1>
              <ItemIcon
                icon={item.icon}
                name={item.name}
                shadow={true}
                title={item?.examine ?? undefined}
                className="mr-4 3xs:scale-125 sm:scale-150"
              />
            </div>
            <div className="mb-3">
              <PageDescription>Live Grand Exchange pricing information for {item.name}</PageDescription>
            </div>
            <ItemInfoGridDisplay item={item} />
            <div className="mt-8">
              <DynamicTimeIntervalOptions />
            </div>
            <DynamicPriceChart id={item.id} />
          </div>
        </PriceChartProvider>
      </div>
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

export default ItemPage;
