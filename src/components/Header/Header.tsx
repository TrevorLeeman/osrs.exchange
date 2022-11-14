import Link from 'next/link';

import { Text } from '@nextui-org/react';

import HomeIcon from '../Icons/Home';
import ItemTable from '../ItemTable/ItemTable';
import Search from '../Search/Search';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Header = () => {
  return (
    <header className="flex items-center gap-5 p-4 sm:grid sm:grid-cols-3">
      <Link href="/">
        <a>
          <div className="hidden sm:block">
            <Text
              css={{
                textGradient: '45deg, $blue600 -20%, $pink600 50%',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              OSRS Exchange
            </Text>
          </div>
          <div className="sm:hidden">
            <HomeIcon />
          </div>
        </a>
      </Link>
      <div className="flex grow justify-center">
        <Search />
      </div>
      <div className="hidden justify-end sm:flex">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
