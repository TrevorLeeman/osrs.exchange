import Link from 'next/link';

import { Text } from '@nextui-org/react';

import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
import HomeIcon from '../Icons/Home';
import ItemTable from '../ItemTable/ItemTable';
import Search from '../Search/Search';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Header = () => {
  const isMinTablet = useTailwindMinBreakpoint('sm');

  return (
    <header className="flex items-center gap-5 p-4 sm:grid sm:grid-cols-3">
      <Link href="/" title="OSRS Exchange Homepage">
        {isMinTablet ? (
          <span className="bg-gradient-to-b from-yellow-400 to-yellow-500 bg-clip-text text-2xl font-bold text-transparent">
            OSRS Exchange
          </span>
        ) : (
          <HomeIcon />
        )}
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
