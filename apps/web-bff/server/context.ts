import { prisma } from '@vetted/db/src';
import { getAuth } from './middleware/auth';

export async function createContext(req: Request) {
  const auth = getAuth(req);
  return { prisma, auth };
}

export type AppContext = Awaited<ReturnType<typeof createContext>>;


