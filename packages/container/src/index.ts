import type { AuthProvider } from '@vetted/ports';
import { InMemoryAuth } from '@vetted/adapters';

export type Registry = {
  auth: AuthProvider;
};

export function createRequestContainer(): Registry {
  return {
    auth: new InMemoryAuth(),
  };
}


