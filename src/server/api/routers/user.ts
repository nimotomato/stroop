import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "src/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure
  .input(z.object({ email: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.user.findMany({ 
      where:
        {
          email: input.email
        }
    });
  }),

  createUser: publicProcedure
  .input(z.object({ 
    email: z.string(), 
    gender: z.string(), 
    dateOfBirth: z.date(), 
    currentOccupation: z.string(), 
    highestEdu: z.string()  }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.user.create({
      data: { ...input }
    });
  })
});
