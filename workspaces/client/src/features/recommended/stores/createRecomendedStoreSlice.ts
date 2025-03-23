import { lens } from '@dhmk/zustand-lens';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/api/schema';
import { produce } from 'immer';
import type { ArrayValues } from 'type-fest';

import { recommendedService } from '@wsh-2025/client/src/features/recommended/services/recommendedService';

type ReferenceId = string;
type RecommendedModuleId = string;

interface RecommendedState {
  recommendedModules: Record<
    RecommendedModuleId,
    ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>
  >;
  references: Record<ReferenceId, RecommendedModuleId[]>;
}

interface RecommendedActions {
  fetchRecommendedModulesByReferenceId: (params: {
    referenceId: ReferenceId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const createRecommendedStoreSlice = () => {
  return lens<RecommendedState & RecommendedActions>((set, get) => ({
    fetchRecommendedModulesByReferenceId: async ({ referenceId }) => {
      const subState = get();
      if (subState.references[referenceId]) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return subState.references[referenceId].map((id) => subState.recommendedModules[id]!);
      }

      const modules = await recommendedService.fetchRecommendedModulesByReferenceId({ referenceId });
      set((state) => {
        return produce(state, (draft) => {
          draft.references[referenceId] = modules.map((module) => module.id);
          for (const module of modules) {
            draft.recommendedModules[module.id] = module;
          }
        });
      });
      return modules;
    },
    recommendedModules: {},
    references: {},
  }));
};
