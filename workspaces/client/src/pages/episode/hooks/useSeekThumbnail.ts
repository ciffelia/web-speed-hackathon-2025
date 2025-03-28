import type { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/api/schema';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

export const useSeekThumbnail = ({ episode }: Params): string => {
  return `/streams/episode/${episode.id}/thumbnail.jpg`;
};
