import type { GetServerSideProps, NextPage } from 'next';
import type { BasicItem } from '../../db/items';
import React from 'react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { ParsedUrlQuery } from 'querystring';
import { Collapse, Container, Loading, Spacer, Text } from '@nextui-org/react';
import axios from 'axios';
import knex from '../../db/db';
import ItemIcon from '../../components/ItemIcon/ItemIcon';
import ItemInfo from '../../components/ItemInfo/ItemInfo';
import PriceChart from '../../components/PriceChart/PriceChart';

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

const ItemPage: NextPage = ({ dehydratedState }: any) => {
  const {
    data: searchListData,
    isLoading: searchListIsLoading,
    isFetching: searchListIsFetching,
  } = useQuery<Pick<BasicItem, 'id' | 'name' | 'icon'>[]>('getSearchList');
  const { data: itemData, isLoading: itemIsLoading, isFetching: itemIsFetching } = useQuery<BasicItem[]>('getItem');
  const item = itemData ? itemData[0] : null;

  console.log(searchListData);
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
          contentLeft={<ItemIcon item={item} width={50} height={50} />}
          subtitle={`Pricing information for ${item.name}`}
          disabled={item.tradeable_on_ge === false}
          expanded={item.tradeable_on_ge !== false}
        >
          <PriceChart id={item.id} />
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

export const fetchPricing = async (id: number) =>
  axios
    .get<RealTimePrices>(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=5m&id=${id}`)
    .then(res => res.data);

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug } = context.params as Params;
  const itemId = parseInt(slug[slug.length - 1], 10);
  const queryClient = new QueryClient();

  queryClient.prefetchQuery('getSearchList', async () =>
    knex.select('id', 'name', 'icon').from<BasicItem>('item').where('tradeable_on_ge', true).limit(5).orderBy('name'),
  );

  if (itemId !== NaN) {
    const item = queryClient.prefetchQuery('getItem', async () =>
      knex.select().from<BasicItem>('item').where(knex.raw('id = ?', itemId)),
    );

    const priceData = queryClient.prefetchQuery('pricing_5m', async () => fetchPricing(itemId));

    await Promise.all([item, priceData]);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default ItemPage;
