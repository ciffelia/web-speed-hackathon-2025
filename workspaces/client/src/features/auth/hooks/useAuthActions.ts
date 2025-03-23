import { useMemo } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthActions() {
  const closeDialog = useStore((state) => state.features.auth.closeDialog);
  const openSignInDialog = useStore((state) => state.features.auth.openSignInDialog);
  const openSignOutDialog = useStore((state) => state.features.auth.openSignOutDialog);
  const openSignUpDialog = useStore((state) => state.features.auth.openSignUpDialog);
  const signIn = useStore((state) => state.features.auth.signIn);
  const signOut = useStore((state) => state.features.auth.signOut);
  const signUp = useStore((state) => state.features.auth.signUp);

  return useMemo(
    () => ({
      closeDialog,
      openSignInDialog,
      openSignOutDialog,
      openSignUpDialog,
      signIn,
      signOut,
      signUp,
    }),
    [closeDialog, openSignInDialog, openSignOutDialog, openSignUpDialog, signIn, signOut, signUp],
  );
}
