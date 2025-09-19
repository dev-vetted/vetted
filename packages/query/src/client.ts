import { createTRPCClient, httpBatchLink } from '@trpc/client';

export function createTRPCQueryClient(url: string): ReturnType<typeof createTRPCClient> {
  return createTRPCClient({
    links: [
      httpBatchLink({
        url,
      }),
    ],
  });
}
