import { createTRPCRouter } from '~/server/api/trpc'
import boardsRouter from './routers/boards'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  boards: boardsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
