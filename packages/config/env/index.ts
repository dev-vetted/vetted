import { z } from 'zod';

export function loadEnv<T extends z.ZodRawShape>(shape: T) {
  const schema = z.object(shape);
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.toString()}`);
  }
  return parsed.data as z.infer<typeof schema>;
}


