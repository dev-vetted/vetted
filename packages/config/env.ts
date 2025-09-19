import { z } from 'zod';

const base = {
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ENV: z.enum(['local', 'staging', 'production']).default('local'),
  PAYMENTS_MODE: z.enum(['test', 'live']).optional(),
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  // Vendor placeholders
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  AGORA_APP_ID: z.string().optional(),
  AGORA_APP_CERT: z.string().optional(),
  IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  IMAGEKIT_URL_ENDPOINT: z.string().optional(),
  UPSTASH_REDIS_URL: z.string().optional(),
  UPSTASH_REDIS_TOKEN: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
};

const baseSchema = z.object(base);

const serverSchema = baseSchema.superRefine((env, ctx) => {
  if (env.APP_ENV === 'staging' && env.PAYMENTS_MODE && env.PAYMENTS_MODE !== 'test') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'staging requires PAYMENTS_MODE=test' });
  }
  if (env.APP_ENV === 'production' && env.PAYMENTS_MODE && env.PAYMENTS_MODE !== 'live') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'production requires PAYMENTS_MODE=live' });
  }
});

export const envServer = serverSchema.parse(process.env);

const clientSchema = baseSchema.pick({
  NEXT_PUBLIC_API_URL: true,
  APP_ENV: true,
});

export type EnvClient = z.infer<typeof clientSchema>;
export const envClient = clientSchema.parse(process.env);


