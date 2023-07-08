import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "src/server/api/trpc";

//TO DO: implement protected procedures

// Stroop data validation
const stroopTestScoreSchema = z.array(
  z.object({
    colorName: z.string(),
    colorValue: z.string(),
    response: z.string(),
    responseTime: z.number(),
  })
);

const stroopInputSchema = z.object({
  testScore: z.array(
    z.object({
      trial: z.string(),
      results: stroopTestScoreSchema,
    })
  ),
  testTaker: z.string(),
});

// Stroop router
export const stroopTestRouter = createTRPCRouter({
  sendData: publicProcedure
    .input(stroopInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.stroopTest.create({
        data: {
          testScore: input.testScore,
          testTaker: {
            connect: { email: input.testTaker },
          },
        },
      });
    }),
});

// CPT data validation
const CPTTestScoreSchema = z.array(
  z.object({ responseTime: z.number(), shape: z.string() })
);

const CPTInputSchema = z.object({
  testScore: z.array(
    z.object({ trial: z.string(), results: CPTTestScoreSchema })
  ),
  testTaker: z.string(),
});

// CPT router
export const CPTTestRouter = createTRPCRouter({
  sendData: publicProcedure.input(CPTInputSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.cPTTest.create({
      data: {
        testScore: input.testScore,
        testTaker: {
          connect: { email: input.testTaker },
        },
      },
    });
  }),
});
