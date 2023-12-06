import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, privateProcedure } from '../trpc'

const subtasksRouter = createTRPCRouter({
  update: privateProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        isCompleted: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx
      const { id, title, isCompleted } = input

      const targetSubtask = await db.subtask.findUnique({
        where: { id, Task: { Column: { Board: { userId } } } },
      })

      if (!targetSubtask) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Subtask not found or does not belong to the user',
        })
      }

      try {
        const updatedSubtask = await db.subtask.update({
          where: { id },
          data: { title, isCompleted },
        })
        return updatedSubtask
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not update subtask',
          cause: error instanceof Error ? error : undefined,
        })
      }
    }),
})

export default subtasksRouter
