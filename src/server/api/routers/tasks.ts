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

  update: privateProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        columnId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx
      const { id, title, description, columnId } = input

      try {
        const targetTask = await db.task.findUnique({
          where: { id, Column: { Board: { userId } } },
        })

        if (!targetTask) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Task not found or does not belong to the user',
          })
        }

        return await db.task.update({
          where: { id },
          data: { title, description, columnId },
        })
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not update task',
          cause: error instanceof Error ? error : undefined,
        })
      }
    }),

  get: privateProcedure
    .input(
      z.object({
        id: z
          .union([z.string(), z.number()])
          .transform((value) => Number(value))
          .refine(
            (value) => !Number.isNaN(value),
            "Couldn't parse the task id",
          ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, userId } = ctx
      const { id } = input

      try {
        const targetTask = await db.task.findUnique({
          where: { id, Column: { Board: { userId } } },
          include: { subtasks: true },
        })

        if (!targetTask) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Task not found or does not belong to the user',
          })
        }

        return targetTask
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not get task',
          cause: error instanceof Error ? error : undefined,
        })
      }
    }),
})

export default tasksRouter
