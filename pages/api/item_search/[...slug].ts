import type { NextApiRequest, NextApiResponse } from 'next';
import { listeners } from 'process';
import knex from '../../../src/db/db';
import { BasicItem } from '../../../src/db/items';

type Data = {
  items: Pick<BasicItem, 'id' | 'name' | 'icon'>[];
};

// If URL parameter is a list of values, extract the first one
const firstParameter = (param: string | string[] | undefined) => {
  if (Array.isArray(param)) return param[0];

  return param;
};

// Returns tradeable items who's name matches slug passed in
// Results are ordered by names that contain slug first, then on similarity score
const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    if (req.method === 'GET') {
      let { slug, limit } = req.query;

      limit = firstParameter(limit) ?? '10';
      slug = firstParameter(slug);

      const topItems = await knex
        .select('im.id', 'im.name', 'im.icon')
        .from<BasicItem>({ im: 'item_mapping' })
        .orderByRaw('CASE WHEN im.name ILIKE ? THEN 0 ELSE 1 END', `%${slug}%`)
        .orderByRaw('SIMILARITY(im.name, ?) DESC', slug)
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
