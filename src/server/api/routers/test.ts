import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "src/server/api/trpc";


const testScoreSchema = z.array(
  z.object({
    colorName: z.string(),
    colorValue: z.string(),
    response: z.string(),
    responseTime: z.number(),
  })
);

const inputSchema = z.object({
  testScore: z.array(
    z.object({
      trial: z.string(),
      results: testScoreSchema,
    })
  ),
  testTaker: z.string(),
});

export const testRouter = createTRPCRouter({
  sendData: publicProcedure.input(inputSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.test.create({
      data: {
        testScore: input.testScore,
        testTaker: {
          connect: { email: input.testTaker },
        },
      },
    });
  }),

});
