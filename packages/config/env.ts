import { z } from 'zod';

// Base environment variables schema
const baseEnvSchema = {
  // Environment Configuration
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ENV: z.enum(['local', 'staging', 'production']).default('local'),

  // API URLs
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  EXPO_PUBLIC_API_URL: z.string().url().optional(),

  // Database
  DATABASE_URL: z.string().url().optional(),

  // Payments
  PAYMENTS_MODE: z.enum(['test', 'live']).optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  EXPO_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),

  // Video/Communication
  AGORA_APP_ID: z.string().optional(),
  AGORA_APP_CERT: z.string().optional(),
  NEXT_PUBLIC_AGORA_APP_ID: z.string().optional(),
  EXPO_PUBLIC_AGORA_APP_ID: z.string().optional(),

  // Storage (AWS S3)
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),

  // Supabase
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional(), // Server-only
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),

  // Cache / Queue (Upstash Redis)
  UPSTASH_REDIS_URL: z.string().optional(),
  UPSTASH_REDIS_TOKEN: z.string().optional(),

  // Image Processing
  IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),
};

const baseSchema = z.object(baseEnvSchema);

// Server-side environment schema (includes all sensitive data)
const serverSchema = baseSchema.superRefine((env, ctx) => {
  // Environment-specific validation rules
  
  // Staging must use test payments
  if (env.APP_ENV === 'staging' && env.PAYMENTS_MODE && env.PAYMENTS_MODE !== 'test') {
    ctx.addIssue({ 
      code: z.ZodIssueCode.custom, 
      message: 'Staging environment requires PAYMENTS_MODE=test' 
    });
  }

  // Production must use live payments
  if (env.APP_ENV === 'production' && env.PAYMENTS_MODE && env.PAYMENTS_MODE !== 'live') {
    ctx.addIssue({ 
      code: z.ZodIssueCode.custom, 
      message: 'Production environment requires PAYMENTS_MODE=live' 
    });
  }

  // Production should have required variables
  if (env.APP_ENV === 'production') {
    if (!env.DATABASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'DATABASE_URL is required in production'
      });
    }
    if (!env.NEXT_PUBLIC_API_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'NEXT_PUBLIC_API_URL is required in production'
      });
    }
  }

  // Razorpay key validation
  if (env.RAZORPAY_KEY_ID) {
    const isTestKey = env.RAZORPAY_KEY_ID.startsWith('rzp_test_');
    const isLiveKey = env.RAZORPAY_KEY_ID.startsWith('rzp_live_');
    
    if (env.PAYMENTS_MODE === 'test' && !isTestKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Test payments mode requires test Razorpay key (rzp_test_)'
      });
    }
    
    if (env.PAYMENTS_MODE === 'live' && !isLiveKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Live payments mode requires live Razorpay key (rzp_live_)'
      });
    }
  }
});

// Client-side environment schema (only NEXT_PUBLIC_ variables)
const clientSchema = baseSchema.pick({
  APP_ENV: true,
  NODE_ENV: true,
  NEXT_PUBLIC_API_URL: true,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: true,
  NEXT_PUBLIC_AGORA_APP_ID: true,
  NEXT_PUBLIC_SUPABASE_URL: true,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: true,
});

// Mobile environment schema (only EXPO_PUBLIC_ variables)
const mobileSchema = baseSchema.pick({
  APP_ENV: true,
  NODE_ENV: true,
  EXPO_PUBLIC_API_URL: true,
  EXPO_PUBLIC_RAZORPAY_KEY_ID: true,
  EXPO_PUBLIC_AGORA_APP_ID: true,
  EXPO_PUBLIC_SUPABASE_URL: true,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: true,
});

// Export parsed environments
export const envServer = serverSchema.parse(process.env);
export const envClient = clientSchema.parse(process.env);
export const envMobile = mobileSchema.parse(process.env);

// Type exports
export type EnvServer = z.infer<typeof serverSchema>;
export type EnvClient = z.infer<typeof clientSchema>;
export type EnvMobile = z.infer<typeof mobileSchema>;

// Helper functions
export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side
    return envClient.NEXT_PUBLIC_API_URL || window.location.origin;
  } else {
    // Server-side
    return envServer.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }
}

export function isProduction(): boolean {
  return envServer.APP_ENV === 'production';
}

export function isStaging(): boolean {
  return envServer.APP_ENV === 'staging';
}

export function isDevelopment(): boolean {
  return envServer.APP_ENV === 'local';
}

// Environment validation utility
export function validateEnvironment(): { 
  isValid: boolean; 
  errors: string[]; 
  warnings: string[]; 
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    serverSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map(e => e.message));
    }
  }

  // Additional warnings
  if (!envServer.DATABASE_URL && envServer.APP_ENV !== 'local') {
    warnings.push('DATABASE_URL is not set');
  }

  if (!envServer.RAZORPAY_KEY_ID && envServer.APP_ENV !== 'local') {
    warnings.push('RAZORPAY_KEY_ID is not set');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}