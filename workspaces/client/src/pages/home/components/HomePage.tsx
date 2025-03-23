import { useLoaderData } from 'react-router';

import type { createStore } from '@wsh-2025/client/src/app/createStore';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const state = store.getState();
  const modules =
    state.features.recommended.references[
      'entrance'
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ]?.map((moduleId) => state.features.recommended.recommendedModules[moduleId]!) ??
    (await state.features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' }));
  return { modules };
};

export const HomePage = () => {
  const { modules } = useLoaderData<typeof prefetch>();

  return (
    <>
      <title>Home - AremaTV</title>

      <div className="w-full py-[48px]">
        {modules.map((module, i) => {
          return (
            <div key={module.id} className="mb-[24px] px-[24px]">
              <RecommendedSection loading={i <= 2 ? 'eager' : 'lazy'} module={module} />
            </div>
          );
        })}
      </div>
    </>
  );
};
