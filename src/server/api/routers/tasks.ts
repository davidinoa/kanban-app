import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, privateProcedure } from '~/server/api/trpc'

const tasksRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        taskTitle: z.string(),
        description: z.string().optional(),
        columnId: z.number(),
        subtasks: z
          .array(
            z.object({
              subtaskTitle: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { taskTitle, description, columnId, subtasks } = input

      const column = await ctx.db.column.findFirst({
        where: {
          id: columnId,
          Board: {
            userId: ctx.userId,
          },
        },
      })

      if (!column) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Column not found or does not belong to the user',
        })
      }

      return ctx.db.$transaction(async (prisma) => {
        const newTask = await prisma.task.create({
          data: {
            columnId,
            description,
            title: taskTitle,
            status: column.name,
            subtasks: {
              create:
                subtasks?.map((subtask) => ({
                  title: subtask.subtaskTitle,
                  isCompleted: false,
                })) ?? [],
            },
          },
        })

        return newTask
      })
    }),
})

export default tasksRouter
