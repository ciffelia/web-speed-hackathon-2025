import { DateTime } from 'luxon';
import type { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type ChannelId = string;

export function useTimetable() {
  const channels = Object.values(useStore((s) => s.features.channel.channels));
  const programs = Object.values(useStore((s) => s.features.timetable.programs));

  const record: Record<ChannelId, ArrayValues<typeof programs>[]> = {};

  for (const channel of channels) {
    const filteredPrograms = [];

    for (const program of programs) {
      if (program.channelId === channel.id) {
        filteredPrograms.push(program);
      }
    }

    record[channel.id] = filteredPrograms.sort((a, b) => {
      return parseIso(a.startAt) - parseIso(b.startAt);
    });
  }

  return record;
}

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
