import { createFetch } from '@better-fetch/fetch';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/api/schema';

import type { serviceSchema } from './authServiceSchema';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  schema: undefined as unknown as typeof serviceSchema,
  throw: true,
});

interface AuthService {
  fetchSignIn: (
    body: StandardSchemaV1.InferOutput<typeof schema.signInRequestBody>,
  ) => Promise<StandardSchemaV1.InferOutput<typeof schema.signInResponse>>;
  fetchSignOut: () => Promise<void>;
  fetchSignUp: (
    body: StandardSchemaV1.InferOutput<typeof schema.signUpRequestBody>,
  ) => Promise<StandardSchemaV1.InferOutput<typeof schema.signUpResponse>>;
  fetchUser: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getUserResponse>>;
}

export const authService: AuthService = {
  async fetchSignIn({ email, password }) {
    const data = await $fetch('/signIn', { body: { email, password }, method: 'POST' });
    return data;
  },
  async fetchSignOut() {
    await $fetch('/signOut', { method: 'POST' });
  },
  async fetchSignUp({ email, password }) {
    const data = await $fetch('/signUp', { body: { email, password }, method: 'POST' });
    return data;
  },
  async fetchUser() {
    const data = await $fetch('/users/me');
    return data;
  },
};
