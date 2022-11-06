import Link from 'next/link';

import { Input, Text } from '@nextui-org/react';

import Search from '../Search/Search';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/">
          <Text
            css={{
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
          >
            OSRS Prices
          </Text>
        </Link>
      </div>
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
