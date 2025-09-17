import { initTRPC } from '@trpc/server';
import type { AppContext } from '../context';

export const t = initTRPC.context<AppContext>().create();


