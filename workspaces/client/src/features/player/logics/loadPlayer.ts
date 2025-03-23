import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import type { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

type PlayerWrapperConstructor = new () => PlayerWrapper;

export const loadPlayer = async (playerType: PlayerType): Promise<PlayerWrapperConstructor> => {
  switch (playerType) {
    case PlayerType.HlsJS: {
      const { HlsJSPlayerWrapper } = await import('@wsh-2025/client/src/features/player/logics/HlsJSPlayerWrapper');
      return HlsJSPlayerWrapper;
    }
    case PlayerType.VideoJS: {
      const { VideoJSPlayerWrapper } = await import('@wsh-2025/client/src/features/player/logics/VideoJSPlayerWrapper');
      return VideoJSPlayerWrapper;
    }
    default: {
      playerType satisfies never;
      throw new Error('Invalid player type.');
    }
  }
};
