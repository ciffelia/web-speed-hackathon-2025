import { createSchema } from '@better-fetch/fetch';
import * as schema from '@wsh-2025/schema/src/api/schema';

export const serviceSchema = createSchema({
  '/series': {
    output: schema.getSeriesResponse,
    query: schema.getSeriesRequestQuery,
  },
  '/series/:seriesId': {
    output: schema.getSeriesByIdResponse,
  },
});
