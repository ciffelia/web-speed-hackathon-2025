import '@wsh-2025/server/src/setups/luxon';

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import cors from '@fastify/cors';
import fastify from 'fastify';

import { registerApi } from '@wsh-2025/server/src/api';
import { initializeDatabase } from '@wsh-2025/server/src/drizzle/database';
import { registerSsr } from '@wsh-2025/server/src/ssr';
import { registerStreams } from '@wsh-2025/server/src/streams';

async function main() {
  await initializeDatabase();

  const distFiles = await fs.readdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist'));
  for (const file of distFiles) {
    if (file.startsWith('main') && file.endsWith('.js')) {
      // @ts-expect-error ..........
      globalThis.AREMATV_SCRIPT_URL = `/public/${file}`;
    } else if (file.startsWith('main') && file.endsWith('.css')) {
      // @ts-expect-error ..........
      globalThis.AREMATV_STYLESHEET_URL = `/public/${file}`;
    }
  }
  // @ts-expect-error ..........
  if (globalThis.AREMATV_SCRIPT_URL == null || globalThis.AREMATV_STYLESHEET_URL == null) {
    throw new Error('Failed to find main.js or main.css');
  }

  const app = fastify();

  // app.addHook('onSend', async (_req, reply) => {
  //   reply.header('cache-control', 'no-store');
  // });
  app.register(cors, {
    origin: true,
  });
  app.register(registerApi, { prefix: '/api' });
  app.register(registerStreams);
  app.register(registerSsr);

  await app.ready();
  const address = await app.listen({ host: '0.0.0.0', port: Number(process.env['PORT']) });
  console.log(`Server listening at ${address}`);
}

void main();
