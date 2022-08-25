import type { NextApiRequest, NextApiResponse } from 'next';
import knex from '../../../src/db/db';
import { BasicItem } from '../../../src/db/items';

type Data = {
  topItems: Pick<BasicItem, 'id' | 'name' | 'icon'>[];
};

const firstParameter = (param: string | string[] | undefined) => {
  if (Array.isArray(param)) return param[0];

  return param;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    if (req.method === 'GET') {
      let { slug, limit } = req.query;

      limit = firstParameter(limit) ?? '5';
      slug = firstParameter(slug);

      const topItems = await knex
        .select('id', 'name', 'icon')
        .from<BasicItem>('item')
        .where('tradeable_on_ge', true)
        .andWhereRaw('name ILIKE ?', [`%${slug}%`])
        .limit(parseInt(limit, 10))
        .orderBy('name');

      res.status(200).json({ topItems });
    }

    return res.status(405);
  } catch (e) {
    console.error(e);
    res.status(500);
  }
};

export default handler;
