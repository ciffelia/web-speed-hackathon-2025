import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

import type { createStore } from '@wsh-2025/client/src/app/createStore';
import { Layout } from '@wsh-2025/client/src/features/layout/components/Layout';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const user = await store.getState().features.auth.fetchUser();
  return { user };
};

const stylesheetId = 'arematv-main-stylesheet';
const scriptId = 'arematv-main-script';

export const Document = () => {
  // @ts-expect-error ..........
  const stylesheetUrl = (globalThis.AREMATV_STYLESHEET_URL ??
    document.getElementById(stylesheetId)?.getAttribute('href')) as string;
  // @ts-expect-error ..........
  const scriptUrl = (globalThis.AREMATV_SCRIPT_URL ?? document.getElementById(scriptId)?.getAttribute('src')) as string;

  return (
    <html className="size-full" lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link href={stylesheetUrl} id={stylesheetId} rel="stylesheet" />
        <script id={scriptId} src={scriptUrl}></script>
      </head>
      <body className="size-full bg-[#000000] text-[#ffffff]">
        <Suspense>
          <Layout>
            <Outlet />
          </Layout>
        </Suspense>
        <ScrollRestoration />
      </body>
    </html>
  );
};
