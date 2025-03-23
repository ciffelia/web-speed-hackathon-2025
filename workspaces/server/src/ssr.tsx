import path from 'node:path';
import { PassThrough } from 'node:stream';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import type { FastifyInstance } from 'fastify';
import { createStandardRequest } from 'fastify-standard-request-reply';
import htmlescape from 'htmlescape';
import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';

export function registerSsr(app: FastifyInstance): void {
  app.register(fastifyStatic, {
    immutable: true,
    maxAge: '30d',
    prefix: '/public/',
    root: [
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist'),
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public'),
    ],
  });

  app.get('/favicon.ico', (_, reply) => {
    reply.status(404).send();
  });

  app.get('/*', async (req, reply) => {
    // @ts-expect-error ................
    const request = createStandardRequest(req, reply);

    const store = createStore({});
    const handler = createStaticHandler(createRoutes(store));
    const context = await handler.query(request);

    if (context instanceof Response) {
      return reply.send(context);
    }

    // https://github.com/remix-run/react-router/blob/b97a9c848a67e6875735ec1d08554c99a517e318/packages/react-router/lib/dom/server.tsx#L124-L129
    // https://github.com/remix-run/react-router/blob/b97a9c848a67e6875735ec1d08554c99a517e318/packages/react-router/lib/dom/server.tsx#L402-L416
    const storeHydrateScript = `window.__zustandHydrationData = JSON.parse(${htmlescape(JSON.stringify(store.getState()))});`;

    const router = createStaticRouter(handler.dataRoutes, context);
    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <StaticRouterProvider context={context} router={router} />
        </StoreProvider>
        {/* https://github.com/remix-run/react-router/blob/b97a9c848a67e6875735ec1d08554c99a517e318/packages/react-router/lib/dom/server.tsx#L157-L163 */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: storeHydrateScript }} />
      </StrictMode>,
      {
        // @ts-expect-error ..........
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        bootstrapScripts: [globalThis.AREMATV_SCRIPT_URL!],
        onShellReady() {
          const stream = new PassThrough();
          reply.header('content-type', 'text/html').send(stream);
          pipe(stream);
        },
      },
    );
  });
}
