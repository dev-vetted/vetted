import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  health: t.router({
    ping: t.procedure.query(() => ({ ok: true })),
  }),
  echo: t.procedure
    .input(
      z.object({
        msg: z.string(),
      }),
    )
    .query(({ input }) => ({ msg: input.msg })),
});

export type AppRouter = typeof appRouter;


