import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "src/server/api/trpc";


export const testRouter = createTRPCRouter({
    sendData: publicProcedure
  .input(z.object({
    testScore: z.array(
      z.object({
        colorName: z.string(),
        colorValue: z.string(),
        response: z.string(),
        responseTime: z.number(),
      })),
    testTaker: z.string()
  }))
  .mutation(( {ctx, input}) => {
    return ctx.prisma.test.create({
      data: {
        testScore: input.testScore,
        testTaker: {
          connect: { email: input.testTaker }
        }
      }
    })
  })
});
