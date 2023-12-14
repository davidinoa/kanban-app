import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, privateProcedure } from '~/server/api/trpc'

// Define a separate schema for ID validation
const idSchema = z
  .union([z.string(), z.number()])
  .transform((value) => Number(value))
  .refine(
    (value) => !Number.isNaN(value),
    "Invalid 'id': must be a number or a string representing a number.",
  )

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
        description: z.string().nullable().optional(),
        columnId: z.number().optional(),
        subtasks: z
          .array(
            z.object({
              subtaskId: idSchema.optional(), // Renamed from id to subtaskId
              subtaskTitle: z.string(),
              isCompleted: z.boolean().optional().default(false),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx
      const { id, title, description, columnId, subtasks } = input

      return db.$transaction(async (prisma) => {
        try {
          const targetTask = await prisma.task.findUnique({
            where: { id, Column: { Board: { userId } } },
            include: { subtasks: true },
          })

          if (!targetTask) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Task not found or does not belong to the user',
            })
          }

          const updatedTask = await prisma.task.update({
            where: { id },
            data: { title, description, columnId },
          })

          // Update and create subtasks
          await Promise.all(
            subtasks?.map(async (subtask) => {
              if (subtask.subtaskId) {
                // Update existing subtask
                await prisma.subtask.update({
                  where: { id: subtask.subtaskId },
                  data: {
                    title: subtask.subtaskTitle,
                    isCompleted: subtask.isCompleted,
                  },
                })
              } else {
                // Create new subtask
                await prisma.subtask.create({
                  data: {
                    title: subtask.subtaskTitle,
                    taskId: id,
                    isCompleted: subtask.isCompleted,
                  },
                })
              }
            }) ?? [],
          )

          // Filter out undefined values from subtask IDs
          const subtaskIdsToUpdate =
            subtasks
              ?.map((subtask) => subtask.subtaskId)
              .filter(
                (subtaskId): subtaskId is number => subtaskId !== undefined,
              ) ?? []

          // Delete subtasks not included in the update
          await prisma.subtask.deleteMany({
            where: {
              taskId: id,
              NOT: {
                id: { in: subtaskIdsToUpdate },
              },
            },
          })

          return updatedTask
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not update task',
            cause: error instanceof Error ? error : undefined,
          })
        }
      })
    }),

  get: privateProcedure
    .input(
      z.object({
        id: idSchema,
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

  delete: privateProcedure
    .input(
      z.object({
        id: idSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx
      const { id } = input

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

        await db.task.delete({
          where: { id },
        })

        return { message: 'Task and its subtasks successfully deleted' }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not delete task',
          cause: error instanceof Error ? error : undefined,
        })
      }
    }),
})

export default tasksRouter
