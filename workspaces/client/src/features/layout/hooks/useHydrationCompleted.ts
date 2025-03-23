import { useSyncExternalStore } from 'react';

export const useHydrationCompleted = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
};
