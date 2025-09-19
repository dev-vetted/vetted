import { prisma } from '@vetted/db';
import { getAuth } from './middleware/auth';
import { envServer } from '@vetted/config/env';

export async function createContext(req: Request) {
  const auth = getAuth(req);
  return { 
    prisma, 
    auth, 
    env: envServer 
  };
}

export type AppContext = Awaited<ReturnType<typeof createContext>>;


