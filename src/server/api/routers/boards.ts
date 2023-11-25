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
