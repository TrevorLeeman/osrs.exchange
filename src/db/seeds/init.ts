import type { Knex } from 'knex';
import type {
  BasicItem,
  Equipment as EquipmentType,
  Item,
  Items,
  Requirements as RequirementsType,
  Weapon as WeaponType,
  WeaponStance as WeaponStanceType,
} from '../items';
import itemsCompleteJson from '../../../items/items-complete.json';

export interface Weapon extends WeaponType {
  id: number;
}

export interface WeaponStance extends WeaponStanceType {
  id: number;
}

export interface Equipment extends EquipmentType {
  id: number;
}

export interface Requirements {
  id: number;
  attack: number;
  strength: number;
  defence: number;
  ranged: number;
  prayer: number;
  magic: number;
  runecraft: number;
  hitpoints: number;
  crafting: number;
  mining: number;
  smithing: number;
  fishing: number;
  cooking: number;
  firemaking: number;
  woodcutting: number;
  agility: number;
  herblore: number;
  thieving: number;
  fletching: number;
  slayer: number;
  farming: number;
  construction: number;
  hunter: number;
}

export async function seed(knex: Knex): Promise<void> {
  const items = itemsCompleteJson as Items;
  let itemList: BasicItem[] = [];
  let weaponList: Omit<Weapon, 'stances'>[] = [];
  let weaponStanceList: WeaponStance[] = [];
  let equipmentList: Omit<Equipment, 'requirements'>[] = [];
  let requirementsList: Requirements[] = [];

  await truncateAllTables(knex);

  // Seed entries based on items-complete.json file
  Object.values(items).forEach(item => {
    itemList.push(dbItem(item));
    item.weapon && weaponList.push(dbWeapon(item.id, item.weapon));
    item.weapon?.stances.forEach(stance => weaponStanceList.push(dbStance(item.id, stance)));
    item.equipment && equipmentList.push(dbEquipment(item.id, item.equipment));
    item.equipment?.requirements && requirementsList.push(dbRequirement(item.id, item.equipment.requirements));
  });

  const insertItem = knex.batchInsert('item', itemList, 200);
  const insertWeapon = knex.batchInsert('weapon', weaponList, 200);
  const insertEquipment = knex.batchInsert('equipment', equipmentList, 200);
  const insertRequirements = knex.batchInsert('requirements', requirementsList, 200);
  await Promise.all([insertItem, insertWeapon, insertEquipment, insertRequirements]);
  await knex.batchInsert('weapon_stance', weaponStanceList, 200);

  console.log('✔ init seed completed successfully!');
}

async function truncateAllTables(knex: Knex) {
  const truncateItem = knex('item').del();
  const truncateWeapon = knex('weapon').del();
  const truncateWeaponStance = knex('weapon_stance').del();
  const truncateEquipment = knex('equipment').del();
  const truncateRequirements = knex('requirements').del();

  return Promise.all([truncateItem, truncateWeapon, truncateWeaponStance, truncateEquipment, truncateRequirements]);
}

function dbItem(item: Item): BasicItem {
  return {
    id: item.id,
    name: item.name,
    last_updated: item.last_updated,
    incomplete: item.incomplete,
    members: item.members,
    tradeable: item.tradeable,
    tradeable_on_ge: item.tradeable_on_ge,
    stackable: item.stackable,
    stacked: item.stacked,
    noted: item.noted,
    noteable: item.noteable,
    linked_id_item: item.linked_id_item,
    linked_id_noted: item.linked_id_noted,
    linked_id_placeholder: item.linked_id_placeholder,
    placeholder: item.placeholder,
    equipable: item.equipable,
    equipable_by_player: item.equipable_by_player,
    equipable_weapon: item.equipable_weapon,
    cost: item.cost,
    lowalch: item.lowalch,
    highalch: item.highalch,
    weight: item.weight,
    buy_limit: item.buy_limit,
    quest_item: item.quest_item,
    release_date: item.release_date,
    duplicate: item.duplicate,
    examine: item.examine,
    icon: item.icon,
    wiki_name: item.wiki_name,
    wiki_url: item.wiki_url,
  };
}

function dbWeapon(id: number, weapon: WeaponType): Omit<Weapon, 'stances'> {
  return {
    id,
    attack_speed: weapon.attack_speed,
    weapon_type: weapon.weapon_type,
  };
}

function dbStance(id: number, stance: WeaponStanceType): WeaponStance {
  return {
    id,
    combat_style: stance.combat_style,
    attack_type: stance.attack_type,
    attack_style: stance.attack_style,
    experience: stance.experience,
    boosts: stance.boosts,
  };
}

function dbEquipment(id: number, equipment: EquipmentType): Omit<Equipment, 'requirements'> {
  return {
    id,
    attack_stab: equipment.attack_stab,
    attack_slash: equipment.attack_slash,
    attack_crush: equipment.attack_crush,
    attack_magic: equipment.attack_magic,
    attack_ranged: equipment.attack_ranged,
    defence_stab: equipment.defence_stab,
    defence_slash: equipment.defence_slash,
    defence_crush: equipment.defence_crush,
    defence_magic: equipment.defence_magic,
    defence_ranged: equipment.defence_ranged,
    melee_strength: equipment.melee_strength,
    ranged_strength: equipment.ranged_strength,
    magic_damage: equipment.magic_damage,
    prayer: equipment.prayer,
    slot: equipment.slot,
  };
}

function dbRequirement(id: number, requirements: RequirementsType): Requirements {
  return {
    id,
    attack: requirements.attack,
    strength: requirements.strength,
    defence: requirements.defence,
    ranged: requirements.ranged,
    prayer: requirements.prayer,
    magic: requirements.magic,
    runecraft: requirements.runecraft,
    hitpoints: requirements.hitpoints,
    crafting: requirements.crafting,
    mining: requirements.mining,
    smithing: requirements.smithing,
    fishing: requirements.fishing,
    cooking: requirements.cooking,
    firemaking: requirements.firemaking,
    woodcutting: requirements.woodcutting,
    agility: requirements.agility,
    herblore: requirements.herblore,
    thieving: requirements.thieving,
    fletching: requirements.fletching,
    slayer: requirements.slayer,
    farming: requirements.farming,
    construction: requirements.construction,
    hunter: requirements.hunter,
  };
}
