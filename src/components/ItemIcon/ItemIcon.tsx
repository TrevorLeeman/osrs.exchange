import { Container, useTheme as useNextUiTheme } from '@nextui-org/react';

type ItemIconProps = { name: string; icon: string; id?: number; width?: number; height?: number };

const ItemIcon = ({ name, icon, id, width = 30 }: ItemIconProps) => {
  const { isDark } = useNextUiTheme();

  const src = `https://oldschool.runescape.wiki/images/${encodeURIComponent(icon.replaceAll(' ', '_'))}`;

  return (
    <Container
      display="flex"
      justify="center"
      css={{ width: 'fit-content', padding: 'unset', margin: 'unset', minWidth: `${width}px` }}
    >
      <img
        src={src}
        alt={name}
        title={name}
        key={id}
        style={{
          filter: `contrast(1.25) brightness(1.25) drop-shadow(0 1px 2px ${
            isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0,0,0,0.18)'
          })`,
        }}
      />
    </Container>
  );
};

export default ItemIcon;
