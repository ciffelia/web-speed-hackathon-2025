import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  referenceId: string;
}

export function useRecommended({ referenceId }: Params) {
  const state = useStore((s) => s.features.recommended);

  const moduleIds = state.references[referenceId];

  const modules = (moduleIds ?? [])
    .map((moduleId) => state.recommendedModules[moduleId])
    .filter(<T>(m: T): m is NonNullable<T> => m != null);

  return modules;
}
