import { useCallback } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useMuted() {
  const muted = useStore((s) => s.pages.program.muted);
  const setMuted = useStore((s) => s.pages.program.setMuted);
  const toggleMuted = useCallback(() => {
    setMuted(!muted);
  }, [muted, setMuted]);
  return [muted, toggleMuted] as const;
}
