import type { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../src/db/db';
import { WikiApiMappingItem } from '../../../src/db/seeds/osrs_wiki_api_mapping';

export type HomepageMappingItems = {
  items: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<HomepageMappingItems>) => {
  try {
    if (req.method === 'GET') {
      const homepageMappingItems = await knex
        .select<WikiApiMappingItem[]>(
          'im.id',
          'im.name',
          'im.limit',
          'im.icon',
          'im.value',
          'im.lowalch',
          'im.highalch',
          'im.members',
          'im.examine',
        )
        .from<WikiApiMappingItem>({
          im: 'item_mapping',
        })
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
