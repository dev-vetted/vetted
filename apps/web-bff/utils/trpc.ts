import { createTRPCReact } from '@trpc/react-query';
import type { RootRouter } from '../server/trpc/routers/root';

export const trpc = createTRPCReact<RootRouter>();
