import { Input } from '@nextui-org/react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Header.module.scss';

const Header = () => {
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
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
