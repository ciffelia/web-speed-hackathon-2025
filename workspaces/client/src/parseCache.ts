import { DateTime } from 'luxon';

const cache = new Map<string, number>();

export const parseIso = (iso: string): number => {
  if (cache.has(iso)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cache.get(iso)!;
  }
  const parsed = DateTime.fromISO(iso).toMillis();
  cache.set(iso, parsed);
  return parsed;
};
