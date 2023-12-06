import { createTRPCRouter } from '~/server/api/trpc'
import boardsRouter from './routers/boards'
import columnsRouter from './routers/columns'
import settingsRouter from './routers/settings'
import subtasksRouter from './routers/subtasks'
import tasksRouter from './routers/tasks'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  boards: boardsRouter,
  columns: columnsRouter,
  tasks: tasksRouter,
  subtasks: subtasksRouter,
  settings: settingsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
