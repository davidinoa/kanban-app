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
})

export default boardsRouter
