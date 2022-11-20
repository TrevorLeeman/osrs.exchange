import Link from 'next/link';

import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
import HomeIcon from '../Icons/Home';
import Search from '../Search/Search';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Header = () => {
  const isMinTablet = useTailwindMinBreakpoint('sm');

  return (
    <header className="mb-3 flex items-center gap-5 sm:mb-6 sm:grid sm:grid-cols-3 lg:mb-12">
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
