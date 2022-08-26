import Image from 'next/image';
import { BasicItem, Item } from '../../db/items';

type ItemIconProps = { name: string; icon: string; id?: number; width?: number; height?: number };

const ItemIcon = ({ name, icon, id, width = 30, height = 27 }: ItemIconProps) =>
  icon ? (
    <Image src={`data:image/jpeg;base64,${icon}`} width={width} height={height} alt={name} title={name} key={id} />
  ) : null;

export default ItemIcon;
