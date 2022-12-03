type ItemIconProps = { name: string; icon: string; id?: number; className?: string; shadow?: boolean; title?: string };

const ItemIcon = ({ name, icon, id, className, shadow = false, title }: ItemIconProps) => {
  const src = `https://oldschool.runescape.wiki/images/${encodeURIComponent(icon.replaceAll(' ', '_'))}`;
  return (
    <img
      src={src}
      alt={name}
      title={title ?? name}
      key={id}
      className={`brightness-125 contrast-125 ${
        shadow ? 'drop-shadow-item-icon-light filter dark:drop-shadow-item-icon-dark' : ''
      } ${className}`}
    />
  );
};

export default ItemIcon;
