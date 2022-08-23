import { useTheme as useNextTheme } from 'next-themes';
import { Input, Switch, useTheme } from '@nextui-org/react';
import styles from './Header.module.scss';

const Header = () => {
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();
  return (
    <header className={styles.header}>
      <div className={styles.left} />
      <div className={styles.center}>
        <Input
          placeholder="Search for an item"
          aria-label="Item search"
          type="search"
          autoComplete="false"
          css={{ flexGrow: 1, maxWidth: '450px' }}
          clearable
        />
      </div>
      <div className={styles.right}>
        <Switch checked={isDark} onChange={e => setTheme(e.target.checked ? 'dark' : 'light')} />
      </div>
    </header>
  );
};

export default Header;
