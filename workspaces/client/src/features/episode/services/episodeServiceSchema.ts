import { createSchema } from '@better-fetch/fetch';
import * as schema from '@wsh-2025/schema/src/api/schema';

export const serviceSchema = createSchema({
  '/episodes': {
    output: schema.getEpisodesResponse,
    query: schema.getEpisodesRequestQuery,
  },
  '/episodes/:episodeId': {
    output: schema.getEpisodeByIdResponse,
  },
});
