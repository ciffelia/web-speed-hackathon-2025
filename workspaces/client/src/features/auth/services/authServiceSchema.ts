import { createSchema } from '@better-fetch/fetch';
import * as schema from '@wsh-2025/schema/src/api/schema';

export const serviceSchema = createSchema({
  '/signIn': {
    input: schema.signInRequestBody,
    output: schema.signInResponse,
  },
  '/signOut': {},
  '/signUp': {
    input: schema.signUpRequestBody,
    output: schema.signUpResponse,
  },
  '/users/me': {
    output: schema.getUserResponse,
  },
});
