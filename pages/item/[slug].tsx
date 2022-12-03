import { useMemo } from 'react';

import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Loading } from '@nextui-org/react';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { ParsedUrlQuery } from 'querystring';

import NotFound from '../../src/components/404/NotFound';
import BackArrowIcon from '../../src/components/Icons/BackArrow';
import ItemIcon from '../../src/components/ItemIcon/ItemIcon';
import { ItemInfoGrid } from '../../src/components/ItemInfoGrid/ItemInfoGrid';
import { PriceChartProps } from '../../src/components/PriceChart/PriceChart';
import PriceChartProvider from '../../src/components/PriceChart/PriceChartProvider';
import TimeIntervalOptions from '../../src/components/PriceChart/TimeIntervalOptions';
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

  const router = useRouter();
  const item = itemData ? itemData[0] : null;
  const title = useMemo(() => `${item?.name} | OSRS Exchange`, [item?.name]);

  if (itemIsLoading) return <Loading />;

  return item ? (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="mb-3">
        <PriceChartProvider>
          <div className="grid grid-cols-[min-content_auto] gap-y-2 gap-x-3 px-3">
            <button onClick={() => router.back()} title="Go back" className="w-min">
              <BackArrowIcon className="h-9 w-9 xs:h-12 xs:w-12" />
            </button>
            <div className="col-start-2 flex items-center gap-1.5 xs:gap-6">
              <h1 className="text-3xl font-bold xs:text-4xl sm:text-5xl">{item.name}</h1>
              <ItemIcon
                icon={item.icon}
                name={item.name}
                shadow={true}
                title={item?.examine ?? undefined}
                className="mr-4 3xs:scale-125 sm:scale-150"
              />
            </div>
            <div className="col-start-2 mb-3">
              <span className="text-gray-500">Live Grand Exchange pricing information for {item.name}</span>
            </div>
            <div className="col-start-2">
              <ItemInfoGrid item={item} />
            </div>
            <div className="col-start-2 mt-10">
              <DynamicTimeIntervalOptions />
            </div>
            <div className="col-start-2">
              <DynamicPriceChart id={item.id} />
            </div>
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
