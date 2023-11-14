import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const boardsRouter = createTRPCRouter({
  // Add a procedure to get all boards for a user including nested data
  getAllBoardsForUser: publicProcedure
    .input(z.object({ userId: z.string().min(1) })) // Validate input as a string with at least one character
    .query(async ({ ctx, input }) => {
      // Use a Prisma query to fetch boards with nested relations
      return ctx.db.board.findMany({
        where: {
          userId: input.userId, // Filter boards by userId provided in input
        },
        include: {
          columns: {
            include: {
              tasks: {
                include: {
                  subtasks: true, // Include subtasks nested under tasks
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc", // Optional: Order by creation date if required
        },
      });
    }),
});

// You'll need to integrate this router with your main app router using `mergeRouters` from TRPC.
