import { exampleRouter } from "src/server/api/routers/example";
import { createTRPCRouter } from "src/server/api/trpc";
import { userRouter } from "src/server/api/routers/user";
import { testRouter } from "src/server/api/routers/test";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  test: testRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
