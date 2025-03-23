import { lens } from '@dhmk/zustand-lens';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/api/schema';
import { produce } from 'immer';

import { episodeService } from '@wsh-2025/client/src/features/episode/services/episodeService';

type EpisodeId = string;

interface EpisodeState {
  episodes: Record<EpisodeId, StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>>;
  episodesAllFetched: boolean;
}

interface EpisodeActions {
  fetchEpisodeById: (params: {
    episodeId: EpisodeId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>>;
  fetchEpisodes: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodesResponse>>;
}

export const createEpisodeStoreSlice = () => {
  return lens<EpisodeState & EpisodeActions>((set, get) => ({
    episodes: {},
    episodesAllFetched: false,
    fetchEpisodeById: async ({ episodeId }) => {
      const subState = get();
      if (subState.episodes[episodeId]) {
        return subState.episodes[episodeId];
      }

      const episode = await episodeService.fetchEpisodeById({ episodeId });
      set((state) => {
        return produce(state, (draft) => {
          draft.episodes[episode.id] = episode;
        });
      });
      return episode;
    },
    fetchEpisodes: async () => {
      const subState = get();
      if (subState.episodesAllFetched) {
        return Object.values(subState.episodes);
      }

      const episodes = await episodeService.fetchEpisodes();
      set((state) => {
        return produce(state, (draft) => {
          for (const episode of episodes) {
            draft.episodes[episode.id] = episode;
          }
          draft.episodesAllFetched = true;
        });
      });
      return episodes;
    },
  }));
};
