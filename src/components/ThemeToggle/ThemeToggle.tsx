import { Switch, useTheme as useNextUiTheme } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes';
import { useIsClient } from 'usehooks-ts';

import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
import MoonIcon from '../Icons/Moon';
import SunIcon from '../Icons/Sun';

const ThemeToggle = () => {
  const { setTheme } = useNextTheme();
  const { isDark } = useNextUiTheme();
  const isMaxMobile = !useTailwindMinBreakpoint('xs');
  const isClient = useIsClient();

  return isClient ? (
    <Switch
      checked={isDark}
      initialChecked={isDark}
      iconOn={<MoonIcon />}
      iconOff={<SunIcon />}
      onChange={e => setTheme(e.target.checked ? 'dark' : 'light')}
      size={isMaxMobile ? 'md' : 'lg'}
    />
  ) : null;
};

export default ThemeToggle;
