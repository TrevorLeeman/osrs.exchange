import { useState } from 'react';

import { Tooltip, useTheme as useNextUiTheme } from '@nextui-org/react';
import format from 'date-fns/format';
import { ColorFormat, CountdownCircleTimer } from 'react-countdown-circle-timer';
import useCountdown from 'usehooks-ts/dist/esm/useCountdown/useCountdown';

import { useItemTableContext } from '../../hooks/useItemTableContext';
import { themeColors } from '../../util/constants';

type UpdatedTimeProps = {
  updatedDate: Date;
};

const CountdownToRefetch = () => {
  const REFETCH_SECONDS = 60;

  const { refetchTableData } = useItemTableContext();
  const { isDark } = useNextUiTheme();
  const [latestPricesUpdated, setLatestPricesUpdated] = useState(new Date());

  const onComplete = () => {
    refetchTableData();
    setLatestPricesUpdated(new Date());
  };

  return (
    <div className="flex items-center gap-4">
      <UpdatedTime updatedDate={latestPricesUpdated} />
      <Tooltip content={'Countdown to item data refresh'} className="cursor-default">
        <CountdownCircleTimer
          isPlaying
          key={latestPricesUpdated.toString()}
          size={25}
          strokeWidth={5}
          duration={REFETCH_SECONDS}
          onComplete={onComplete}
          strokeLinecap="butt"
          colors={isDark ? (themeColors.yellow as ColorFormat) : (themeColors.indigo as ColorFormat)}
          trailColor={isDark ? '#475569' : 'rgb(230, 230, 230)'}
        />
      </Tooltip>
    </div>
  );
};

const UpdatedTime = ({ updatedDate }: UpdatedTimeProps) => (
  <div className="flex flex-col whitespace-nowrap text-center text-xs">
    <span className="font-semibold">Updated</span>
    <span>{format(updatedDate, 'h:mm aaa')}</span>
  </div>
);

export default CountdownToRefetch;
