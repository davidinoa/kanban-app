import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, privateProcedure } from '~/server/api/trpc'

const boardsRouter = createTRPCRouter({
  getAllNames: privateProcedure.query(async ({ ctx }) =>
    ctx.db.board.findMany({
      where: { userId: ctx.userId },
      select: { name: true, id: true },
      orderBy: { createdAt: 'desc' },
    }),
  ),
  getById: privateProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const board = await ctx.db.board.findUnique({
        where: { id: input.id, userId: ctx.userId },
        include: {
          columns: {
            include: {
              tasks: {
                include: {
                  subtasks: true,
                },
              },
            },
          },
        },
      })

      if (!board) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Board not found',
        })
      }

      return board
    }),

  create: privateProcedure
    .input(
      z.object({
        boardName: z.string(),
        columns: z.array(
          z.object({
            columnName: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { boardName, columns } = input
      return ctx.db.$transaction(async (prisma) => {
        const newBoard = await prisma.board.create({
          data: {
            name: boardName,
            userId: ctx.userId,
          },
        })
        await Promise.all(
          columns.map((column) =>
            prisma.column.create({
              data: {
                name: column.columnName,
                boardId: newBoard.id,
              },
            }),
          ),
        )
        return newBoard
      })
    }),

  edit: privateProcedure
    .input(
      z.object({
        boardId: z.number(),
        boardName: z.string(),
        columns: z.array(
          z.object({
            columnId: z.number().optional(),
            columnName: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { boardId, boardName, columns } = input

      return ctx.db.$transaction(async (prisma) => {
        await prisma.board.update({
          where: { id: boardId },
          data: { name: boardName },
        })

        const existingColumns = await prisma.column.findMany({
          where: { boardId },
          select: { id: true },
        })

        const inputColumnIds = columns
          .map((c) => c.columnId)
          .filter((id) => id !== undefined)

        const deleteOperations = existingColumns
          .filter((ec) => !inputColumnIds.includes(ec.id))
          .map((column) => prisma.column.delete({ where: { id: column.id } }))

        const updateOperations = columns
          .filter((column) => column.columnId)
          .map((column) =>
            prisma.column.update({
              where: { id: column.columnId },
              data: { name: column.columnName },
            }),
          )

        const createOperations = columns
          .filter((column) => !column.columnId)
          .map((column) =>
            prisma.column.create({
              data: {
                boardId,
                name: column.columnName,
              },
            }),
          )

        await Promise.all([
          ...deleteOperations,
          ...updateOperations,
          ...createOperations,
        ])
        return { message: 'Board updated successfully' }
      })
    }),

  delete: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input
      const board = await ctx.db.board.findUnique({
        where: { id, userId: ctx.userId },
      })

      if (!board) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Board not found',
        })
      }

      await ctx.db.board.delete({
        where: { id },
      })

      return { message: 'Board deleted successfully' }
    }),
})

export default boardsRouter
