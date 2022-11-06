import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('item', table => {
    table.integer('id').primary();
    table.string('name');
    table.string('last_updated');
    table.boolean('incomplete');
    table.boolean('members');
    table.boolean('tradeable');
    table.boolean('tradeable_on_ge');
    table.boolean('stackable');
    table.integer('stacked');
    table.boolean('noted');
    table.boolean('noteable');
    table.integer('linked_id_item');
    table.integer('linked_id_noted');
    table.integer('linked_id_placeholder');
    table.boolean('placeholder');
    table.boolean('equipable');
    table.boolean('equipable_by_player');
    table.boolean('equipable_weapon');
    table.integer('cost');
    table.integer('lowalch');
    table.integer('highalch');
    table.float('weight');
    table.integer('buy_limit');
    table.boolean('quest_item');
    table.string('release_date');
    table.boolean('duplicate');
    table.string('examine', 1023);
    table.string('icon', 32768);
    table.string('wiki_name');
    table.string('wiki_url');
  });
  await knex.schema.createTable('weapon', table => {
    table.integer('id').primary();
    table.integer('attack_speed');
    table.string('weapon_type');
  });
  await knex.schema.createTable('weapon_stance', table => {
    table.increments('stance_id').primary();
    table.integer('id').references('id').inTable('item');
    table.string('combat_style');
    table.string('attack_type');
    table.string('attack_style');
    table.string('experience');
    table.string('boosts');
  });
  await knex.schema.createTable('equipment', table => {
    table.integer('id').primary();
    table.integer('attack_stab');
    table.integer('attack_slash');
    table.integer('attack_crush');
    table.integer('attack_magic');
    table.integer('attack_ranged');
    table.integer('defence_stab');
    table.integer('defence_slash');
    table.integer('defence_crush');
    table.integer('defence_magic');
    table.integer('defence_ranged');
    table.integer('melee_strength');
    table.integer('ranged_strength');
    table.integer('magic_damage');
    table.integer('prayer');
    table.string('slot');
  });
  await knex.schema.createTable('requirements', table => {
    table.integer('id').primary();
    table.integer('attack');
    table.integer('strength');
    table.integer('defence');
    table.integer('ranged');
    table.integer('prayer');
    table.integer('magic');
    table.integer('runecraft');
    table.integer('hitpoints');
    table.integer('crafting');
    table.integer('mining');
    table.integer('smithing');
    table.integer('fishing');
    table.integer('cooking');
    table.integer('firemaking');
    table.integer('woodcutting');
    table.integer('agility');
    table.integer('herblore');
    table.integer('thieving');
    table.integer('fletching');
    table.integer('slayer');
    table.integer('farming');
    table.integer('construction');
    table.integer('hunter');
  });

  return await knex.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('weapon_stance')
    .then(() => knex.schema.dropTableIfExists('item'))
    .then(() => knex.schema.dropTableIfExists('weapon'))
    .then(() => knex.schema.dropTableIfExists('equipment'))
    .then(() => knex.schema.dropTableIfExists('requirements'));
}
