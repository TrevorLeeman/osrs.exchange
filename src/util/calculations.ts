import { SortDirection } from '@tanstack/react-table';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import fromUnixTime from 'date-fns/fromUnixTime';

import { TableItem } from '../components/ItemTable/ItemTableProvider';
import { Timestep } from '../components/PriceChart/TimeIntervalOptions';

type SortDescNext = (params: { currentSortDirection: SortDirection | false }) => boolean;

type DistanceToNowStrictFromUnixTime = (params: {
  unixTime: number | null | undefined;
  addSuffix?: boolean;
}) => string | null;

type RoiOutput = (params: {
  instaBuyPrice?: TableItem['instaBuyPrice'];
  instaSellPrice?: TableItem['instaSellPrice'];
  roi?: ReturnType<typeof calculateROI>;
}) => string | null;

type IsEmpty = (value: any) => boolean;

export const calculateTax = (instaBuyPrice: TableItem['instaBuyPrice']) => {
  if (!instaBuyPrice || instaBuyPrice < 100) return 0;
  if (instaBuyPrice >= 500_000_000) return 5_000_000;
  return Math.floor(instaBuyPrice * 0.01);
};

export const calculateMargin = (
  instaBuyPrice: TableItem['instaBuyPrice'],
  instaSellPrice: TableItem['instaSellPrice'],
) => {
  if (!instaBuyPrice || !instaSellPrice) return null;
  return instaBuyPrice - instaSellPrice;
};

export const calculateProfit = (
  instaBuyPrice: TableItem['instaBuyPrice'],
  instaSellPrice: TableItem['instaSellPrice'],
) => {
  if (!instaBuyPrice || !instaSellPrice) return null;
  return Number((calculateMargin(instaBuyPrice, instaSellPrice)! - calculateTax(instaBuyPrice)).toFixed(0));
};

export const calculatePotentialProfit = (
  instaBuyPrice: TableItem['instaBuyPrice'],
  instaSellPrice: TableItem['instaSellPrice'],
  limit: TableItem['limit'],
) => {
  if (!instaBuyPrice || !instaSellPrice || !limit) return null;
  return Number((calculateProfit(instaBuyPrice, instaSellPrice)! * limit).toFixed(0));
};

export const calculateROI = (
  instaBuyPrice: TableItem['instaBuyPrice'],
  instaSellPrice: TableItem['instaSellPrice'],
) => {
  if (!instaBuyPrice || !instaSellPrice) return null;
  return (calculateProfit(instaBuyPrice, instaSellPrice)! / instaSellPrice) * 100;
};

export const roiOutput: RoiOutput = ({ instaBuyPrice, instaSellPrice, roi }) => {
  // Accept 0 as a valid roi using isEmpty
  let output = !isEmpty(roi) ? roi : calculateROI(instaBuyPrice, instaSellPrice);
  // Handle -0.00%
  if (!isEmpty(output) && output! < 0 && Math.abs(output!) < 0.01) {
    output = 0;
  }
  return !isEmpty(output) ? `${parseFloat(output!.toFixed(2)).toLocaleString()}%` : null;
};

export const calculateAlchProfit = (
  instaSellPrice: TableItem['instaSellPrice'],
  alchValue: TableItem['highAlch'],
  natureRunePrice: number | undefined,
) => {
  if (isEmpty(alchValue) || isEmpty(instaSellPrice) || isEmpty(natureRunePrice)) return null;
  return alchValue! - instaSellPrice! - natureRunePrice!;
};

export const distanceToNowStrictFromUnixTime: DistanceToNowStrictFromUnixTime = ({ unixTime, addSuffix = false }) => {
  if (isEmpty(unixTime)) return null;
  return formatDistanceToNowStrict(fromUnixTime(unixTime!), { addSuffix });
};

export const sortDescNext: SortDescNext = ({ currentSortDirection }) => {
  switch (currentSortDirection) {
    case false:
      return true;
    case 'asc':
      return true;
    case 'desc':
      return false;
  }
};

export const isEmpty: IsEmpty = value => {
  return value === null || value === undefined;
};

export const realTimeRefetchInterval = (timestep: Timestep) => {
  switch (timestep) {
    case '5m':
      return 30 * 1000; // 30 seconds
    case '1h':
      return 60 * 1000 * 5; // 5 min
    case '6h':
      return 60 * 1000 * 60; // 1 hour
    default:
      return 30 * 1000; // 30 seconds
  }
};
