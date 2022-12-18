import { useTheme as useNextUiTheme } from '@nextui-org/react';

const useLogoSrc = () => {
  const { isDark } = useNextUiTheme();
  return isDark ? '/logo/logo-rectangle-yellow.png' : '/logo/logo-rectangle-indigo.png';
};

export default useLogoSrc;
