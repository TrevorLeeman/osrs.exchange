import { Input } from '@nextui-org/react';
import Search from '../Search/Search';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left} />
      <div className={styles.center}>
        <Search />
      </div>
      <div className={styles.right}>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
