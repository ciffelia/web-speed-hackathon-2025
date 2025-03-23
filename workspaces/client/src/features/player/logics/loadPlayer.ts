import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import type { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

type PlayerWrapperConstructor = new () => PlayerWrapper;

export const loadPlayer = async (playerType: PlayerType): Promise<PlayerWrapperConstructor> => {
  switch (playerType) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
