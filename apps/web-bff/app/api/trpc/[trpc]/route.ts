import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { rootRouter } from '../../../../server/trpc/routers/root';
import { createContext } from '../../../../server/context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: rootRouter,
    createContext: () => createContext(req),
  });

export { handler as GET, handler as POST };


