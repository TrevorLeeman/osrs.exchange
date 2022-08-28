import Image from 'next/image';

type ItemIconProps = { name: string; icon: string; id?: number; width?: number; height?: number };

const ItemIcon = ({ name, icon, id, width = 30, height = 27 }: ItemIconProps) => {
  // Use base64 image stored in DB if available, fall back on wiki image
  const src = !icon.endsWith('.png')
    ? `data:image/jpeg;base64,${icon}`
    : `https://oldschool.runescape.wiki/images/${encodeURIComponent(icon.replaceAll(' ', '_'))}`;

  return <Image src={src} width={width} height={height} alt={name} title={name} key={id} />;
};

export default ItemIcon;
