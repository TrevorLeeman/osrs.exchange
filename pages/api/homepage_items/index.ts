import type { NextApiRequest, NextApiResponse } from 'next';
import knex from '../../../src/db/db';
import { WikiApiMappingItem } from '../../../src/db/seeds/osrs_wiki_api_mapping';

export type HomepageMappingItems = {
  items: string;
};

export type HomepageMappingItem = Pick<
  WikiApiMappingItem,
  'id' | 'name' | 'limit' | 'icon' | 'value' | 'lowalch' | 'highalch' | 'members'
>;

// Returns tradeable items who's name matches slug passed in
// Results are ordered by names that contain slug first, then on similarity score
const handler = async (req: NextApiRequest, res: NextApiResponse<HomepageMappingItems>) => {
  try {
    if (req.method === 'GET') {
      const homepageMappingItems = await knex
        .select<HomepageMappingItem[]>(
          'im.id',
          'im.name',
          'im.limit',
          knex.raw('CASE WHEN i.icon IS NOT NULL THEN i.icon ELSE im.icon END'),
          'im.value',
          'im.lowalch',
          'im.highalch',
          'im.members',
        )
        .from<WikiApiMappingItem>({
          im: 'item_mapping',
        })
        .leftJoin({ i: 'item' }, 'i.id', 'im.id')
        .whereNot('im.value', 0);

      res.status(200).json({ items: JSON.stringify(homepageMappingItems) });
    }

    return res.status(405);
  } catch (e) {
    console.error(e);
    res.status(500);
  }
};

export default handler;
