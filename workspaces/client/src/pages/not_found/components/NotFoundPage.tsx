import { useLoaderData } from 'react-router';

import type { createStore } from '@wsh-2025/client/src/app/createStore';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const state = store.getState();
  const modules =
    state.features.recommended.references[
      'error'
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ]?.map((moduleId) => state.features.recommended.recommendedModules[moduleId]!) ??
    (await state.features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'error' }));
  return { modules };
};

export const NotFoundPage = () => {
  const { modules } = useLoaderData<typeof prefetch>();
  const module = modules.at(0);

  return (
    <>
      <title>見つかりません - AremaTV</title>

      <div className="w-full px-[32px] py-[48px]">
        <section className="mb-[32px] flex w-full flex-col items-center justify-center gap-y-[20px]">
          <h1 className="text-[32px] font-bold text-[#ffffff]">ページが見つかりませんでした</h1>
          <p>あなたが見ようとしたページは、残念ながら見つけられませんでした。</p>
          <img alt="" className="h-auto w-[640px]" decoding="async" loading="lazy" src="/public/animations/001.gif" />
        </section>
        <section>{module != null ? <RecommendedSection module={module} /> : null}</section>
      </div>
    </>
  );
};
