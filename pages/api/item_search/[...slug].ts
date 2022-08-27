import type { NextApiRequest, NextApiResponse } from 'next';
import knex from '../../../src/db/db';
import { BasicItem } from '../../../src/db/items';

type Data = {
  items: Pick<BasicItem, 'id' | 'name' | 'icon'>[];
};

const firstParameter = (param: string | string[] | undefined) => {
  if (Array.isArray(param)) return param[0];

  return param;
};

// Returns tradeable items who's name matches slug passed in
// Results are ordered by names that begin with slug first, then by name for full text search
const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    if (req.method === 'GET') {
      let { slug, limit } = req.query;

      limit = firstParameter(limit) ?? '10';
      slug = firstParameter(slug);

      const topItems = await knex
        .select('id', 'name', 'icon')
        .from<BasicItem>('item')
        .where('tradeable_on_ge', true)
        .orderByRaw('CASE WHEN name LIKE ? THEN 0 ELSE 1 END', `%${slug}%`)
        .orderByRaw('SIMILARITY(name, ?) DESC', slug)
        .limit(parseInt(limit, 10));

      res.status(200).json({ items: topItems });
    }

    return res.status(405);
  } catch (e) {
    console.error(e);
    res.status(500);
  }
};

export default handler;
