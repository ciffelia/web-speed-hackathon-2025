import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useInitialUnixtimeMs(): number {
  return useStore((s) => s.pages.timetable.initialUnixtimeMs);
}
