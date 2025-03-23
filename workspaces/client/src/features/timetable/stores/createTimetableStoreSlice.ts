import { lens } from '@dhmk/zustand-lens';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/api/schema';
import { produce } from 'immer';
import type { ArrayValues } from 'type-fest';

import { timetableService } from '@wsh-2025/client/src/features/timetable/services/timetableService';

type ProgramId = string;

interface TimetableState {
  programs: Record<ProgramId, ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>>;
  programsByRange: Record<string, ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>[]>;
}

interface TimetableActions {
  fetchTimetable: (params: {
    since: string;
    until: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

export const createTimetableStoreSlice = () => {
  return lens<TimetableState & TimetableActions>((set, get) => ({
    fetchTimetable: async ({ since, until }) => {
      const subState = get();
      const range = `${since}-${until}`;
      if (subState.programsByRange[range]) {
        return subState.programsByRange[range];
      }

      const programs = await timetableService.fetchTimetable({ since, until });
      set((state) => {
        return produce(state, (draft) => {
          draft.programs = {};
          for (const program of programs) {
            draft.programs[program.id] = program;
          }
          draft.programsByRange[range] = programs;
        });
      });
      return programs;
    },
    programs: {},
    programsByRange: {},
  }));
};
