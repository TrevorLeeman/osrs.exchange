import { Switch, useTheme as useNextUiTheme } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes';
import { useIsMounted } from 'usehooks-ts';

const ThemeToggle = () => {
  const { setTheme } = useNextTheme();
  const { isDark } = useNextUiTheme();
  const mounted = useIsMounted();

  if (!mounted()) return null;

  return (
    <Switch checked={isDark} initialChecked={isDark} onChange={e => setTheme(e.target.checked ? 'dark' : 'light')} />
  );
};

export default ThemeToggle;
