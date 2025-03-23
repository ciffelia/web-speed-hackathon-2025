import { DateTime } from 'luxon';
import type { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { parseIso } from '@wsh-2025/client/src/parseCache';

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
