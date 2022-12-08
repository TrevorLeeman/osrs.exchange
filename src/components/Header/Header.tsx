import Link from 'next/link';

import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
import HomeIcon from '../Icons/Home';
import { Search } from '../Search/Search';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Header = () => {
  const isMinTablet = useTailwindMinBreakpoint('sm');

  return (
    <header className="mb-4 flex items-center gap-3 px-2 sm:mb-6 sm:grid sm:grid-cols-[auto_1fr_auto] md:grid-cols-3 lg:mb-12">
      <div>
        <Link href="/" title="OSRS Exchange Homepage">
          {isMinTablet ? (
            <span className="bg-gradient-to-b from-indigo-500 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent dark:from-yellow-400 dark:to-yellow-500">
              OSRS Exchange
            </span>
          ) : (
            <HomeIcon />
          )}
        </Link>
      </div>
      <div className="flex grow justify-center">
        <Search />
      </div>
      <div className=" flex items-center justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
