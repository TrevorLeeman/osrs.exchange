import { useTheme as useNextUiTheme } from '@nextui-org/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { useItemTableContext } from '../../../hooks/useItemTableContext';

type SkeletonCellProps = {
  children: React.ReactNode;
};

const SkeletonCell = ({ children }: SkeletonCellProps) => {
  const { isDark } = useNextUiTheme();
  const { tableDataReady } = useItemTableContext();

  return tableDataReady ? (
    <>{children}</>
  ) : (
    <Skeleton
      height={8}
      className="text-cyan-600"
      baseColor={isDark ? 'rgb(14 116 144)' : 'rgb(203 213 225)'}
      highlightColor={isDark ? 'rgb(6 182 212)' : 'rgb(159, 155, 238)'}
      borderRadius={5}
    />
  );
};

export default SkeletonCell;
