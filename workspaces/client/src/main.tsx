import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/unocss';

import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import type { HydrationState } from 'react-router';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';

import './main.css';

declare global {
  var __zustandHydrationData: unknown;
  var __staticRouterHydrationData: HydrationState;
}

function main() {
  const store = createStore({
    hydrationData: window.__zustandHydrationData,
  });
  const router = createBrowserRouter(createRoutes(store), {
    hydrationData: window.__staticRouterHydrationData,
  });

  hydrateRoot(
    document,
    <StrictMode>
      <StoreProvider createStore={() => store}>
        <RouterProvider router={router} />
      </StoreProvider>
    </StrictMode>,
  );
}

document.addEventListener('DOMContentLoaded', main);
