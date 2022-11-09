import resolveConfig from 'tailwindcss/resolveConfig';
import { KeyValuePair } from 'tailwindcss/types/config.js';
import { useMediaQuery } from 'usehooks-ts';

import tailwindConfig from '../../tailwind.config.js';

type ThemeBreakpoints = 'xs' | '2xs' | '3xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const resolvedConfig = resolveConfig(tailwindConfig);
const breakpoints = resolvedConfig.theme?.screens! as KeyValuePair<string, string>;

const useTailwindMinBreakpoint = (tailwindBreakpoint: ThemeBreakpoints) => {
  const minBreakpointExists = useMediaQuery(`(min-width: ${breakpoints[tailwindBreakpoint]}`);
  return minBreakpointExists;
};

export default useTailwindMinBreakpoint;
