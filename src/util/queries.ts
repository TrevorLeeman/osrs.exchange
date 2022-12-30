import { QueryFunction } from '@tanstack/react-query';
import axios from 'axios';

import { HomepageMappingItems } from '../../pages/api/homepage_items';
import { ItemInfoGridProps } from '../components/ItemInfoGrid/ItemInfoGrid';
import { Timestep } from '../components/PriceChart/TimeIntervalOptions';
import { SearchItem } from '../components/Header/Search';
import { WikiApiMappingItem } from '../db/seeds/osrs_wiki_api_mapping';

export type RealTimePrices = {
  data: [Price];
};

export type LongTermPrices = {
  [key: number]: LongTermPrice[];
};

type LongTermPrice = {
  id: string;
  price: number;
  volume: number | null;
  timestamp: number;
};

interface Price {
  avgHighPrice: number;
  avgLowPrice: number;
  highPriceVolume: number;
  lowPriceVolumne: number;
  timestamp: number;
}

export type LatestTransactions = {
  data: {
    [id: string]: LatestTransaction;
  };
};

export type LatestTransaction = {
  high: number | null;
  highTime: number | null | undefined;
  low: number | null;
  lowTime: number | null | undefined;
};

export type DailyVolumes = {
  timestamp: number;
  data: {
    [id: string]: number;
  };
};

export const ITEM_TABLE_QUERIES = {
  latestPrices: 'latest_prices',
  dailyVolumes: 'daily_volumes',
  itemMapping: 'item_mapping',
};

export const ITEM_PAGE_QUERIES = {
  realTimePrices: 'real_time_prices',
  longTermPrices: 'long_term_prices',
  itemById: 'item_by_id',
};

export const fetchLatestPrices: QueryFunction<LatestTransactions> = async () => {
  return axios.get<LatestTransactions>('https://prices.runescape.wiki/api/v1/osrs/latest').then(res => res.data);
};

export const fetchDailyVolumes: QueryFunction<DailyVolumes> = async () => {
  return axios.get<DailyVolumes>('https://prices.runescape.wiki/api/v1/osrs/volumes').then(res => res.data);
};

export const fetchHomepageMappingItems: QueryFunction<WikiApiMappingItem[]> = async () => {
  return axios
    .get<HomepageMappingItems>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/homepage_items`)
    .then(res => JSON.parse(res.data.items));
};

export const fetchLatestTransactions: QueryFunction<LatestTransactions> = async ({ queryKey }) => {
  const [_key, { id }] = queryKey as [string, { id: ItemInfoGridProps['item'] }];
  return axios
    .get<LatestTransactions>(`https://prices.runescape.wiki/api/v1/osrs/latest/?id=${id}`)
    .then(res => res.data);
};

export const fetchAutocompleteList: QueryFunction<SearchItem[]> = async ({ queryKey }) => {
  const [_key, { inputValue }] = queryKey as [string, { inputValue: string }];
  if (!inputValue) return [];

  return axios
    .get<{ items: SearchItem[] }>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/item_search/${inputValue}`)
    .then(res => res.data.items);
};

export const fetchRealTimePrices: QueryFunction<RealTimePrices> = async ({ queryKey }) => {
  const [_key, { id, timestep }] = queryKey as [string, { id: number; timestep: Timestep }];
  return axios
    .get<RealTimePrices>(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=${timestep}&id=${id}`)
    .then(res => res.data);
};

export const fetchLongTermPrices: QueryFunction<LongTermPrices> = async ({ queryKey }) => {
  const [_key, { id }] = queryKey as [string, { id: number }];
  return axios
    .get<LongTermPrices>(`https://api.weirdgloop.org/exchange/history/osrs/all?id=${id}&compress=false`)
    .then(res => res.data);
};
