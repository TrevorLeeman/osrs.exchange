import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('item_mapping', table => {
    table.integer('id').primary();
    table.string('name');
    table.integer('limit');
    table.string('icon', 255);
    table.integer('value');
    table.integer('lowalch');
    table.integer('highalch');
    table.boolean('members');
    table.string('examine', 1023);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('item_mapping');
}
