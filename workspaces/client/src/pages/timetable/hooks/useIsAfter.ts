import type { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

import { useInitialUnixtimeMs } from './useInitialUnixtimeMs';

export const useIsAfter = (target: DateTime) => {
  const initialUnixtimeMs = useInitialUnixtimeMs();
  const initialDiffMs = initialUnixtimeMs - target.toMillis();

  const [isAfter, setIsAfter] = useState<boolean>(initialDiffMs >= 0);

  useEffect(() => {
    const diff = Date.now() - target.toMillis();

    setIsAfter(diff >= 0);
    if (diff >= 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsAfter(true);
    }, -diff);
    return () => {
      clearInterval(timeout);
    };
  }, [target]);

  return isAfter;
};
