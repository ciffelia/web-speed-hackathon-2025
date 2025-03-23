import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  referenceId: string;
}

export function useRecommended({ referenceId }: Params) {
  const moduleIds = useStore((s) => s.features.recommended.references[referenceId]);
  const recommendedModules = useStore((s) => s.features.recommended.recommendedModules);

  const modules = (moduleIds ?? [])
    .map((moduleId) => recommendedModules[moduleId])
    .filter(<T>(m: T): m is NonNullable<T> => m != null);

  return modules;
}
