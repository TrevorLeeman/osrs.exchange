import type { Knex } from 'knex';
import axios from 'axios';

export type WikiApiMappingItem = {
  id: number;
  name: string;
  limit: number;
  icon: string;
  value: number;
  lowalch: number;
  highalch: number;
  members: boolean;
  examine: string;
};

export async function seed(knex: Knex): Promise<void> {
  await truncateAllTables(knex);
  const apiItems = await axios
    .get<WikiApiMappingItem[]>('https://prices.runescape.wiki/api/v1/osrs/mapping')
    .then(res => res.data);
  const dbItems = apiItems.map(item => {
    return {
      id: item.id,
      name: item.name,
      limit: item.limit,
      icon: item.icon,
      value: item.value,
      lowalch: item.lowalch,
      highalch: item.highalch,
      members: item.members,
      examine: item.examine,
    };
  });
  await knex.batchInsert('item_mapping', dbItems, 200);

  console.log('✔ osrs_wiki_api_mapping seed completed successfully!');
}

async function truncateAllTables(knex: Knex) {
  return await knex('item_mapping').del();
}
