import Image from 'next/image';
import Link from 'next/link';

import { Variants, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

import useLogoSrc from '../../hooks/useLogoSrc';
import HorizontalPadding from '../Common/HorizontalPadding';
import LinkBlue from '../Common/LinkBlue';
import { headerFooterClasses } from '../Header/Header';
import DiscordIcon from '../Icons/Discord';

const discordVariants: Variants = {
  initial: { rotate: 0 },
  animate: { rotate: -45 },
};

const Footer = () => {
  const logoSrc = useLogoSrc();

  return (
    <footer className={twMerge(['mt-4', headerFooterClasses])}>
      <HorizontalPadding>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-sm">
          <motion.li variants={discordVariants} initial="initial" whileHover="animate" title="Discord">
            <motion.a href="https://discord.gg/yZ3bGDT3" target="_blank" rel="noreferrer">
              <DiscordIcon />
            </motion.a>
          </motion.li>
          <li className="flex flex-col items-center gap-2">
            <Link href="/" title="Go to Homepage" className="w-fit">
              <Image src={logoSrc} alt="OSRS Exchange" width="100" height="25" />
            </Link>
            <p>Made with ❤ in Gielinor</p>
          </li>
          <li>
            <LinkBlue href="/attribution">Attribution</LinkBlue>
          </li>
        </ul>
      </HorizontalPadding>
    </footer>
  );
};

export default Footer;
