import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { refetchOnWindowFocus: false, retry: 1 },
    },
  });
}

export function createTRPCQueryClient(url: string): ReturnType<typeof createTRPCClient> {
  return createTRPCClient({
    links: [
      httpBatchLink({
        url,
      }),
    ],
  });
}
