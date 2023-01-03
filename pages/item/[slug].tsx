import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { Loading } from '@nextui-org/react';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ParsedUrlQuery } from 'querystring';

import NotFound from '../../src/components/404/404';
import H1 from '../../src/components/Common/H1';
import HorizontalPadding from '../../src/components/Common/HorizontalPadding';
import LinkThemed from '../../src/components/Common/LinkThemed';
import PageDescription from '../../src/components/Common/PageDescription';
import LinkExternalIcon from '../../src/components/Icons/LinkExternal';
import ItemIcon, { itemIconUrl } from '../../src/components/ItemIcon/ItemIcon';
import { ItemInfoGridDisplay } from '../../src/components/ItemInfoGrid/ItemInfoGrid';
import { PriceChartProvider } from '../../src/components/PriceChart/PriceChartProvider';
import knex from '../../src/db/db';
import type { BasicItem } from '../../src/db/items';
import { WikiApiMappingItem } from '../../src/db/seeds/osrs_wiki_api_mapping';
import { ITEM_PAGE_QUERIES } from '../../src/util/queries';

interface Params extends ParsedUrlQuery {
  slug: [string];
}

export interface ItemPageItem extends WikiApiMappingItem {
  weight: BasicItem['weight'];
  release_date: BasicItem['release_date'];
  wiki_url: BasicItem['wiki_url'];
}

const DynamicPriceChart = dynamic(() => import('../../src/components/PriceChart/PriceChart'), {
  ssr: false,
});

const DynamicTimeIntervalOptions = dynamic(() => import('../../src/components/PriceChart/TimeIntervalOptions'), {
  ssr: false,
});

const containerVariants = {
  hidden: {},
  show: {},
};

const itemVariants = {
  hidden: { opacity: 0, x: -500, scale: 0.8 },
  show: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', bounce: 0.2, duration: 1 } },
};

const ItemPage: NextPage = ({ dehydratedState }: any) => {
  const {
    data: itemData,
    isLoading: itemIsLoading,
    isFetching: itemIsFetching,
  } = useQuery<ItemPageItem[]>([ITEM_PAGE_QUERIES.itemById]);

  const item = itemData ? itemData[0] : null;
  const title = `${item?.name} - Live GE Price Graph - OSRS Exchange`;
  const description = `Live Grand Exchange price graph for ${item?.name}. Flip and trade with prices updated every 30 seconds.`;
  const iconUrl = item ? itemIconUrl(item.icon) : null;

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
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        {iconUrl ? (
          <>
            <link rel="icon" type="image/png" href={iconUrl} />
            <meta property="og:image" content={iconUrl} />
            <meta property="twitter:image" content={iconUrl} />
            {/* <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" /> */}
          </>
        ) : null}
      </Head>
      <HorizontalPadding>
        <PriceChartProvider id={item.id}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-y-2 px-3"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-1.5 xs:gap-6">
              <H1>{item.name}</H1>
              <ItemIcon
                icon={item.icon}
                name={item.name}
                shadow={true}
                title={item?.examine ?? undefined}
                className="mr-4 3xs:scale-125 sm:scale-150"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="mb-3">
              <PageDescription>Live Grand Exchange pricing information for {item.name}</PageDescription>
            </motion.div>
            <motion.div variants={itemVariants}>
              <ItemInfoGridDisplay item={item} />
            </motion.div>
            <motion.div variants={itemVariants} className="mt-4 mb-1 flex gap-3 sm:mt-8 sm:mb-0">
              <DynamicTimeIntervalOptions />
              {item?.wiki_url ? (
                <LinkThemed href={item.wiki_url} className="flex items-center gap-1">
                  <LinkExternalIcon />
                  <span>Wiki</span>
                </LinkThemed>
              ) : null}
            </motion.div>
            <DynamicPriceChart />
          </motion.div>
        </PriceChartProvider>
      </HorizontalPadding>
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
