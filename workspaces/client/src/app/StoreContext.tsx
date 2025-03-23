import React, { type ComponentProps, useContext, useSyncExternalStore } from 'react';
import type { ExtractState } from 'zustand/vanilla';
import { createContext } from 'zustand-di';

import type { createStore } from '@wsh-2025/client/src/app/createStore';

const [DiStoreProvider, useStore] = createContext<ExtractState<ReturnType<typeof createStore>>>();

const StoreApiContext = React.createContext<ReturnType<typeof createStore> | null>(null);

const StoreProvider: React.FC<ComponentProps<typeof DiStoreProvider>> = (props) => {
  const storeApi = props.createStore();

  return (
    <StoreApiContext value={storeApi}>
      <DiStoreProvider {...props} createStore={() => storeApi} />
    </StoreApiContext>
  );
};

export const useSsrFriendlyStore: typeof useStore = (selector) => {
  const state = useStore(selector);
  const storeApi = useContext(StoreApiContext);

  return useSyncExternalStore(
    () => () => {},
    () => state,
    () => {
      if (!storeApi) {
        throw new Error('StoreApiContext is not available');
      }
      const state = storeApi.getState();
      return selector(state);
    },
  );
};

export { StoreProvider, useSsrFriendlyStore as useStore };
