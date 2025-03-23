import { createSchema } from '@better-fetch/fetch';
import * as schema from '@wsh-2025/schema/src/api/schema';

export const serviceSchema = createSchema({
  '/programs': {
    output: schema.getProgramsResponse,
    query: schema.getProgramsRequestQuery,
  },
  '/programs/:episodeId': {
    output: schema.getProgramByIdResponse,
    params: schema.getProgramByIdRequestParams,
  },
});
