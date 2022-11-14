import { useEffect, useRef, useState } from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import { KeyValuePair } from 'tailwindcss/types/config.js';
import { useMediaQuery } from 'usehooks-ts';

import tailwindConfig from '../../tailwind.config.js';

type ThemeBreakpoints = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const resolvedConfig = resolveConfig(tailwindConfig);
const breakpoints = resolvedConfig.theme?.screens! as KeyValuePair<string, string>;

const useTailwindMinBreakpoint = (tailwindBreakpoint: ThemeBreakpoints) => {
  const [value, setValue] = useState<boolean | null>(null);
  const minBreakpointExists = useMediaQuery(`(min-width: ${breakpoints[tailwindBreakpoint]}`);

  useEffect(() => {
    setValue(minBreakpointExists);
  }, [minBreakpointExists]);

  return value;
};

export default useTailwindMinBreakpoint;
