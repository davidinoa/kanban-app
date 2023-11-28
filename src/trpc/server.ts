import 'server-only'

import {
  createTRPCProxyClient,
  loggerLink,
  TRPCClientError,
} from '@trpc/client'
import { callProcedure } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { type TRPCErrorResponse } from '@trpc/server/rpc'
import { cookies } from 'next/headers'
import { cache } from 'react'

import { appRouter } from '~/server/api/root'
import { createTRPCContext } from '~/server/api/trpc'
import { transformer } from './shared'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() =>
  Promise.resolve(
    createTRPCContext({
      headers: new Headers({
        cookie: cookies().toString(),
        'x-trpc-source': 'rsc',
      }),
    }),
  ),
)

const api = createTRPCProxyClient<typeof appRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
    /**
     * Custom RSC link that lets us invoke procedures without using http requests. Since Server
     * Components always run on the server, we can just call the procedure as a function.
     */
    () =>
      ({ op }) =>
        observable((observer) => {
          createContext()
            .then((ctx) =>
              callProcedure({
                // eslint-disable-next-line no-underscore-dangle
                procedures: appRouter._def.procedures,
                path: op.path,
                rawInput: op.input,
                ctx,
                type: op.type,
              }),
            )
            .then((data) => {
              observer.next({ result: { data } })
              observer.complete()
            })
            .catch((cause: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(cause))
            })
        }),
  ],
})

export default api
