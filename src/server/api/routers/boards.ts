import { currentUser } from '@clerk/nextjs'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

const boardsRouter = createTRPCRouter({
  getFirst: publicProcedure.query(async ({ ctx }) => {
    const userData = await currentUser()
    const userId = userData?.id
    if (!userId) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
    return ctx.db.board.findFirst({
      where: { userId },
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
  }),
})

export default boardsRouter
