import { Switch, useTheme as useNextUiTheme } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes';
import { useIsClient } from 'usehooks-ts';

const ThemeToggle = () => {
  const { setTheme } = useNextTheme();
  const { isDark } = useNextUiTheme();
  const isClient = useIsClient();

  return isClient ? (
    <Switch checked={isDark} initialChecked={isDark} onChange={e => setTheme(e.target.checked ? 'dark' : 'light')} />
  ) : null;
};

export default ThemeToggle;
