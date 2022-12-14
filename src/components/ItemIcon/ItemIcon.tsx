import { twMerge } from 'tailwind-merge';

type ItemIconProps = { name: string; icon: string; id?: number; className?: string; shadow?: boolean; title?: string };

const ItemIcon = ({ name, icon, id, className, shadow = false, title }: ItemIconProps) => (
  <img
    src={itemIconUrl(icon)}
    alt={name}
    title={title ?? name}
    key={id}
    className={twMerge([
      `brightness-125 contrast-125 ${
        shadow ? 'drop-shadow-item-icon-light filter dark:drop-shadow-item-icon-dark' : ''
      }`,
      className,
    ])}
  />
);

export const itemIconUrl = (icon: ItemIconProps['icon']) => {
  return `https://oldschool.runescape.wiki/images/${encodeURIComponent(icon.replaceAll(' ', '_'))}`;
};

export default ItemIcon;
