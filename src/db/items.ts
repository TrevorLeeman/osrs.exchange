export type Items = {
  [key: string]: Item;
};

export interface Item extends BasicItem {
  equipment: Equipment | null;
  weapon: Weapon | null;
}

export interface BasicItem {
  id: number;
  name: string;
  last_updated: string;
  incomplete: boolean;
  members: boolean;
  tradeable: boolean;
  tradeable_on_ge: boolean;
  stackable: boolean;
  stacked: number | null;
  noted: boolean;
  noteable: boolean;
  linked_id_item: number | null;
  linked_id_noted: number | null;
  linked_id_placeholder: number | null;
  placeholder: boolean;
  equipable: boolean;
  equipable_by_player: boolean;
  equipable_weapon: boolean;
  cost: number;
  lowalch: number | null;
  highalch: number | null;
  weight: number | null;
  buy_limit: number | null;
  quest_item: boolean;
  release_date: string | null;
  duplicate: boolean;
  examine: string | null;
  icon: string;
  wiki_name: string | null;
  wiki_url: string | null;
}

export interface Equipment {
  attack_stab: number;
  attack_slash: number;
  attack_crush: number;
  attack_magic: number;
  attack_ranged: number;
  defence_stab: number;
  defence_slash: number;
  defence_crush: number;
  defence_magic: number;
  defence_ranged: number;
  melee_strength: number;
  ranged_strength: number;
  magic_damage: number;
  prayer: number;
  slot: string;
  requirements: Requirements | null;
}

export interface Requirements {
  [key: string]: number;
}

export interface Weapon {
  attack_speed: number;
  weapon_type: string;
  stances: WeaponStance[];
}

export interface WeaponStance {
  combat_style: string;
  attack_type: string | null;
  attack_style: string | null;
  experience: string;
  boosts: string | null;
}

export type ItemCached = {
  id: number;
  name: string;
  tradeable_on_ge: boolean;
  members: boolean;
  linked_id_item: number;
  linked_id_noted: any;
  linked_id_placeholder: any;
  noted: boolean;
  noteable: boolean;
  placeholder: boolean;
  stackable: boolean;
  equipable: boolean;
  cost: number;
  lowalch: number;
  highalch: number;
  stacked: any;
};
