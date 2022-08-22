import Image from 'next/image';
import { Item } from '../../db/items';

type ItemIconProps = { item: Item; width: number; height: number };

const ItemIcon = ({ item, width, height }: ItemIconProps) => (
  <Image
    src={`data:image/jpeg;base64,${item.icon}`}
    width={width}
    height={height}
    alt={item.name}
    title={item.name}
    key={item.id}
  />
);

export default ItemIcon;
