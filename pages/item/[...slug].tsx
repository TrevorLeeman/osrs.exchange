import type { GetServerSideProps, NextPage } from 'next';
import type { BasicItem } from '../../src/db/items';
import React from 'react';
import { dehydrate, QueryClient, QueryFunction, useQuery } from '@tanstack/react-query';
import { ParsedUrlQuery } from 'querystring';
import { Collapse, Container, Loading, Spacer, Text } from '@nextui-org/react';
import axios from 'axios';
import knex from '../../src/db/db';
import ItemIcon from '../../src/components/ItemIcon/ItemIcon';
import ItemInfo from '../../src/components/ItemInfo/ItemInfo';
import PriceChart from '../../src/components/PriceChart/PriceChart';
import TimeIntervalButtonGroup, {
  Timestep,
} from '../../src/components/TimeIntervalButtonGroup/TimeIntervalButtonGroup';
import PriceChartProvider from '../../src/components/PriceChart/PriceChartProvider';

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
  itemById: 'item_by_id',
};

const ItemPage: NextPage = ({ dehydratedState }: any) => {
  const {
    data: itemData,
    isLoading: itemIsLoading,
    isFetching: itemIsFetching,
  } = useQuery<BasicItem[]>([ITEM_PAGE_QUERIES.itemById]);
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
          contentLeft={<ItemIcon icon={item.icon} name={item.name} width={50} height={45} />}
          subtitle={`Pricing information for ${item.name}`}
          disabled={item.tradeable_on_ge === false}
          expanded={item.tradeable_on_ge !== false}
          css={{ userSelect: 'none' }}
        >
          <PriceChartProvider>
            <Container display="flex" alignItems="center" justify="flex-end">
              <TimeIntervalButtonGroup />
            </Container>
            <PriceChart id={item.id} />
          </PriceChartProvider>
        </Collapse>
        <Collapse title="Item Info" css={{ userSelect: 'none' }}>
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
  return axios
    .get<RealTimePrices>(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=${timestep}&id=${id}`)
    .then(res => res.data);
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug } = context.params as Params;
  const itemId = parseInt(slug[slug.length - 1], 10);
  const queryClient = new QueryClient();

  if (itemId !== NaN) {
    await queryClient.prefetchQuery(
      [ITEM_PAGE_QUERIES.itemById],
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
