import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  episodeId: string;
}

export function useEpisodeById({ episodeId }: Params) {
  const episode = useStore((s) => s.features.episode);

  return episode.episodes[episodeId];
}
