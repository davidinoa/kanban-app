import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, privateProcedure } from '~/server/api/trpc'

const settingsRouter = createTRPCRouter({
  get: privateProcedure.query(async ({ ctx }) => {
    try {
      const settings = await ctx.db.settings.findUnique({
        where: { userId: ctx.userId },
      })
      if (!settings) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Settings not found',
        })
      }
      return settings
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get settings',
      })
    }
  }),

  // Route for updating settings
  update: privateProcedure
    .input(
      z.object({
        theme: z.string().optional(),
        isSidebarOpen: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { theme, isSidebarOpen } = input

      try {
        const updatedSettings = await ctx.db.settings.update({
          where: { userId: ctx.userId },
          data: { theme, isSidebarOpen },
        })
        return updatedSettings
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update settings',
        })
      }
    }),
})

export default settingsRouter
