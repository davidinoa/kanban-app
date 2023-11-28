import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, privateProcedure } from '~/server/api/trpc'

const columnsRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        boardId: z.number(),
        columns: z.array(
          z.object({
            name: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { boardId, columns } = input

      try {
        const createdColumns = await ctx.db.$transaction(
          columns.map((column) =>
            ctx.db.column.create({
              data: {
                name: column.name,
                boardId,
              },
            }),
          ),
        )
        return createdColumns
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create columns',
        })
      }
    }),
})

export default columnsRouter
