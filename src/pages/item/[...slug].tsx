import type { GetServerSideProps, NextPage } from 'next';
import type { BasicItem } from '../../db/items';
import React from 'react';
import { dehydrate, QueryClient, QueryFunction, useQuery } from 'react-query';
import { ParsedUrlQuery } from 'querystring';
import { Collapse, Container, Loading, Spacer, Text } from '@nextui-org/react';
import axios from 'axios';
import knex from '../../db/db';
import ItemIcon from '../../components/ItemIcon/ItemIcon';
import ItemInfo from '../../components/ItemInfo/ItemInfo';
import PriceChart from '../../components/PriceChart/PriceChart';
import TimeIntervalButtonGroup, { Timestep } from '../../components/TimeIntervalButtonGroup/TimeIntervalButtonGroup';
import PriceChartProvider from '../../components/PriceChart/PriceChartProvider';

interface Params extends ParsedUrlQuery {
  slug: [string];
}

export interface RealTimePrices {
  data: [Pricing];
}

export interface Pricing {
  avgHighPrice: number;
  avgLowPrice: number;
  highPriceVolume: number;
  lowPriceVolumne: number;
  timestamp: number;
}

export const ITEM_PAGE_QUERIES = {
  realTimePrices: 'real_time_prices',
  autocomplete: 'autocomplete',
  itemById: 'item_by_id',
};
const ItemPage: NextPage = ({ dehydratedState }: any) => {
  const {
    data: searchListData,
    isLoading: searchListIsLoading,
    isFetching: searchListIsFetching,
  } = useQuery<Pick<BasicItem, 'id' | 'name' | 'icon'>[]>(ITEM_PAGE_QUERIES.autocomplete);
  const {
    data: itemData,
    isLoading: itemIsLoading,
    isFetching: itemIsFetching,
  } = useQuery<BasicItem[]>(ITEM_PAGE_QUERIES.itemById);
  const item = itemData ? itemData[0] : null;

  // console.log(searchListData);
  // console.log(itemData);
  // console.log(pricingData);

  if (itemIsLoading) return <Loading />;

  return item ? (
    <Container fluid>
      <Text h1>{item.name}</Text>
      <Spacer y={1} />
      <Collapse.Group accordion={false} shadow>
        <Collapse
          title="Grand Exchange"
          contentLeft={<ItemIcon item={item} width={50} height={45} />}
          subtitle={`Pricing information for ${item.name}`}
          disabled={item.tradeable_on_ge === false}
          expanded={item.tradeable_on_ge !== false}
        >
          <PriceChartProvider>
            <Container display="flex" alignItems="center" justify="flex-end">
              <TimeIntervalButtonGroup />
            </Container>
            <PriceChart id={item.id} />
          </PriceChartProvider>
        </Collapse>
        <Collapse title="Item Info">
          <ItemInfo item={item} />
        </Collapse>
      </Collapse.Group>
      <Spacer y={1} />
    </Container>
  ) : null;
  // <NotFound />
};

export const fetchPricing: QueryFunction<RealTimePrices> = async ({ queryKey }) => {
  const [_key, { id, timestep }] = queryKey as [string, { id: number; timestep: Timestep }];
  return await axios
    .get<RealTimePrices>(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=${timestep}&id=${id}`)
    .then(res => res.data);
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug } = context.params as Params;
  const itemId = parseInt(slug[slug.length - 1], 10);
  const queryClient = new QueryClient();

  queryClient.prefetchQuery(ITEM_PAGE_QUERIES.autocomplete, async () =>
    knex.select('id', 'name', 'icon').from<BasicItem>('item').where('tradeable_on_ge', true).limit(5).orderBy('name'),
  );

  if (itemId !== NaN) {
    const item = queryClient.prefetchQuery(ITEM_PAGE_QUERIES.itemById, async () =>
      knex.select().from<BasicItem>('item').where(knex.raw('id = ?', itemId)),
    );

    const priceData = queryClient.prefetchQuery(
      [ITEM_PAGE_QUERIES.realTimePrices, { id: itemId, timestep: '5m' }],
      fetchPricing,
    );

    await Promise.all([item, priceData]);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default ItemPage;
