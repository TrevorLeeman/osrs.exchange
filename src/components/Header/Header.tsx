import Image from 'next/image';
import Link from 'next/link';

import { twMerge } from 'tailwind-merge';

import useLogoSrc from '../../hooks/useLogoSrc';
import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
import HorizontalPadding from '../Common/HorizontalPadding';
import HomeIcon from '../Icons/Home';
import { Search } from '../Search/Search';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

export const headerFooterClasses = 'bg-zinc-100 dark:bg-zinc-900 py-3 sm:py-6 border-indigo-600 dark:border-yellow-400';

const Header = () => {
  const isMinTablet = useTailwindMinBreakpoint('sm');
  const logoSrc = useLogoSrc();

  return (
    <header className={twMerge(['mb-6 shadow-sm sm:shadow-md'], headerFooterClasses)}>
      <HorizontalPadding>
        <div className="flex items-center gap-3 sm:grid sm:grid-cols-[auto_1fr_auto] md:grid-cols-3">
          <Link href="/" title="Go to Homepage" className="w-fit">
            {isMinTablet ? <Image src={logoSrc} alt="OSRS Exchange" width="160" height="40" priority /> : <HomeIcon />}
          </Link>
          <div className="flex grow justify-center">
            <Search />
          </div>
          <div className=" flex items-center justify-end">
            <ThemeToggle />
          </div>
        </div>
      </HorizontalPadding>
    </header>
  );
};

export default Header;
