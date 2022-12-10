import { Variants, motion } from 'framer-motion';

import LinkBlue from '../Common/LinkBlue';
import DiscordIcon from '../Icons/Discord';

const discordVariants: Variants = {
  initial: { rotate: 0 },
  animate: { rotate: -45 },
};

const Footer = () => (
  <footer className="mt-12  pb-3">
    <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
      <motion.li variants={discordVariants} initial="initial" whileHover="animate" title="Discord">
        <motion.a href="https://discord.gg/yZ3bGDT3" target="_blank" rel="noreferrer">
          <DiscordIcon />
        </motion.a>
      </motion.li>
      <li>Made with ❤ in Gielinor</li>
      <li>
        <LinkBlue href="/attribution">Attribution</LinkBlue>
      </li>
    </ul>
  </footer>
);

export default Footer;
