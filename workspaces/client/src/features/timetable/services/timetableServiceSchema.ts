import { createSchema } from '@better-fetch/fetch';
import * as schema from '@wsh-2025/schema/src/api/schema';

export const serviceSchema = createSchema({
  '/timetable': {
    output: schema.getTimetableResponse,
    query: schema.getTimetableRequestQuery,
  },
});
