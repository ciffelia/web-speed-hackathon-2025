import { lens } from '@dhmk/zustand-lens';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/api/schema';
import { produce } from 'immer';

import { programService } from '@wsh-2025/client/src/features/program/services/programService';

type ProgramId = string;

interface ProgramState {
  programs: Record<ProgramId, StandardSchemaV1.InferOutput<typeof schema.getProgramByIdResponse>>;
  programsAllFetched: boolean;
}

interface ProgramActions {
  fetchProgramById: (params: {
    programId: ProgramId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getProgramByIdResponse>>;
  fetchPrograms: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getProgramsResponse>>;
}

export const createProgramStoreSlice = () => {
  return lens<ProgramState & ProgramActions>((set, get) => ({
    fetchProgramById: async ({ programId }) => {
      const subState = get();
      if (subState.programs[programId]) {
        return subState.programs[programId];
      }

      const program = await programService.fetchProgramById({ programId });
      set((state) => {
        return produce(state, (draft) => {
          draft.programs[program.id] = program;
        });
      });
      return program;
    },
    fetchPrograms: async () => {
      const subState = get();
      if (subState.programsAllFetched) {
        return Object.values(subState.programs);
      }

      const programs = await programService.fetchPrograms();
      set((state) => {
        return produce(state, (draft) => {
          for (const program of programs) {
            draft.programs[program.id] = program;
          }
          draft.programsAllFetched = true;
        });
      });
      return programs;
    },
    programs: {},
    programsAllFetched: false,
  }));
};
