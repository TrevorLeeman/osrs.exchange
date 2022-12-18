import React, { useEffect, useState } from 'react';

import { useTheme as useNextUiTheme } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTheme as useNextTheme } from 'next-themes';
import { useIsClient } from 'usehooks-ts';

import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
import MoonIcon from '../Icons/Moon';
import SunIcon from '../Icons/Sun';

const ThemeToggle = () => {
  const { setTheme } = useNextTheme();
  const { isDark } = useNextUiTheme();
  const isClient = useIsClient();
  const isMinLargeTablet = useTailwindMinBreakpoint('md');
  const translateY = isMinLargeTablet ? -37 : -34;

  return isClient ? (
    <button
      className="h-9 w-9 cursor-pointer overflow-hidden rounded-full md:h-11 md:w-11"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="theme-toggle"
      title="Toggle Theme"
    >
      <motion.div
        className="flex flex-col items-center gap-4 pt-[9px]"
        initial={{ y: isDark ? 0 : translateY }}
        animate={{
          y: isDark ? 0 : translateY,
          transition: { type: 'spring', duration: 0.3, stiffness: 200, damping: 14 },
        }}
      >
        <MoonIcon className="h-4 w-4 flex-shrink-0 md:h-5 md:w-5" />
        <SunIcon className="h-5 w-5 flex-shrink-0 md:h-6 md:w-6" />
      </motion.div>
    </button>
  ) : (
    // Placeholder to prevent layout shift
    <div className="h-12 w-12" />
  );
};

export default ThemeToggle;
