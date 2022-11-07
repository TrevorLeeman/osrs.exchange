import Link from 'next/link';

import { Text } from '@nextui-org/react';

import Search from '../Search/Search';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Header = () => {
  return (
    <header className="grid grid-cols-3 grid-rows-1 p-4">
      <div className="flex grow items-center">
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
      <div className="flex justify-center">
        <Search />
      </div>
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
