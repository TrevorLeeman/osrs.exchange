import { Container } from '@nextui-org/react';

type ItemIconProps = { name: string; icon: string; id?: number; width?: number; height?: number; shadow?: boolean };

const ItemIcon = ({ name, icon, id, width = 30, shadow = false }: ItemIconProps) => {
  const src = `https://oldschool.runescape.wiki/images/${encodeURIComponent(icon.replaceAll(' ', '_'))}`;
  return (
    <div className="flex w-fit items-center justify-center ">
      <img
        src={src}
        alt={name}
        title={name}
        key={id}
        className={`brightness-125 contrast-125 ${
          shadow ? 'drop-shadow-item-icon-light filter dark:drop-shadow-item-icon-dark' : ''
        }`}
      />
    </div>
  );
};

export default ItemIcon;
