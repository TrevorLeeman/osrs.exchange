import Image from 'next/image';
import { BasicItem, Item } from '../../db/items';

type ItemIconProps = { item: Item | BasicItem | null; width: number; height: number };

const ItemIcon = ({ item, width, height }: ItemIconProps) =>
  item ? (
    <Image
      src={`data:image/jpeg;base64,${item.icon}`}
      width={width}
      height={height}
      alt={item.name}
      title={item.name}
      key={item.id}
    />
  ) : null;

export default ItemIcon;
