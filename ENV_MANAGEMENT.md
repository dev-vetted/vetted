# Environment Management Guide

This guide explains how to manage environment variables across all platforms in the Vetted application.

## 📋 Overview

The Vetted application uses a unified environment management system that works across:
- **Web-BFF** (Next.js backend)
- **Vendor Web** (Next.js frontend)
- **Consumer Web** (Next.js frontend)
- **Mobile** (Expo/React Native)

## 🛠️ Setup for Development

### 1. Initial Setup

```bash
# Copy the local environment template
pnpm env:setup

# Install dependencies
pnpm install

# Validate your environment
pnpm env:validate
```

### 2. Configure Your `.env.local`

Copy from `env.local.example` and update with your actual values:

```bash
# Environment Configuration
APP_ENV=local
NODE_ENV=development

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://localhost:3000

# Database (use your actual database URL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/vetted_dev

# Add your actual service credentials...
```

## 🔧 Environment Structure

### Server-Only Variables (Backend Access)
These are only available in server-side code:
- `DATABASE_URL`
- `RAZORPAY_KEY_SECRET`
- `AGORA_APP_CERT`
- `SUPABASE_SERVICE_KEY`
- `S3_SECRET_ACCESS_KEY`
- `UPSTASH_REDIS_TOKEN`

### Client Variables (Web Apps)
These are exposed to web frontend with `NEXT_PUBLIC_` prefix:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `NEXT_PUBLIC_AGORA_APP_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Mobile Variables (Expo App)
These are exposed to mobile app with `EXPO_PUBLIC_` prefix:
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_RAZORPAY_KEY_ID`
- `EXPO_PUBLIC_AGORA_APP_ID`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 🌍 Environment Types

### Local Development (`APP_ENV=local`)
- Uses `env.local.example` as template
- Points to `localhost:3000` for API
- Uses test payment credentials
- Detailed logging enabled

### Staging (`APP_ENV=staging`)
- Uses `env.staging.example` as template
- Points to staging deployment URL
- **Enforces** test payment mode
- Production-like setup with test data

### Production (`APP_ENV=production`)
- Uses `env.production.example` as template
- Points to production domain
- **Enforces** live payment mode
- Minimal logging for performance

## 🔒 Security & Validation

### Automatic Validation Rules

1. **Payment Mode Enforcement**:
   - Staging → Must use `PAYMENTS_MODE=test`
   - Production → Must use `PAYMENTS_MODE=live`

2. **Key Validation**:
   - Test mode → Must use `rzp_test_` keys
   - Live mode → Must use `rzp_live_` keys

3. **Required Variables**:
   - Production requires `DATABASE_URL` and `NEXT_PUBLIC_API_URL`

### Environment Validation

Run validation anytime:
```bash
pnpm env:validate
```

This checks:
- ✅ All environment variables are properly set
- ✅ Database connectivity
- ✅ Service configuration
- ✅ Security compliance

## 🚀 Deployment Guide

### Web Applications (Vercel)

1. **Environment Variables in Vercel**:
   ```bash
   # Set these in Vercel dashboard
   APP_ENV=staging  # or production
   DATABASE_URL=your_database_url
   NEXT_PUBLIC_API_URL=https://your-bff.vercel.app
   RAZORPAY_KEY_ID=your_key
   RAZORPAY_KEY_SECRET=your_secret
   # ... other variables
   ```

2. **Branch-specific Environments**:
   - `main` branch → Production environment
   - `staging` branch → Staging environment
   - `dev` branch → Development environment

### Mobile Application (Expo)

1. **Environment Configuration**:
   ```bash
   # In your mobile app directory
   cp ../env.local.example .env.local
   
   # Edit with EXPO_PUBLIC_ variables
   EXPO_PUBLIC_API_URL=https://your-api.com
   EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
   ```

2. **Build Variants**:
   ```bash
   # Development build
   APP_ENV=local expo build

   # Staging build  
   APP_ENV=staging expo build

   # Production build
   APP_ENV=production expo build
   ```

## 🔄 Environment Switching

### Development Workflow

```bash
# Switch to staging configuration
cp env.staging.example .env.local
pnpm env:validate

# Switch to production configuration  
cp env.production.example .env.local
pnpm env:validate

# Switch back to local development
cp env.local.example .env.local
pnpm env:validate
```

### Quick Environment Setup

```bash
# Development
pnpm env:setup

# Staging
cp env.staging.example .env.staging

# Production
cp env.production.example .env.production
```

## 📱 Platform-Specific Usage

### Web-BFF (Backend)
```typescript
import { envServer } from '@vetted/config/env';

// Use server environment
const dbUrl = envServer.DATABASE_URL;
const razorpaySecret = envServer.RAZORPAY_KEY_SECRET;
```

### Web Apps (Frontend)
```typescript
import { envClient, getApiUrl } from '@vetted/config/env';

// Use client environment
const apiUrl = getApiUrl();
const razorpayKey = envClient.NEXT_PUBLIC_RAZORPAY_KEY_ID;
```

### Mobile App
```typescript
import Constants from 'expo-constants';

// Use mobile environment
const { apiUrl, razorpayKeyId } = Constants.expoConfig.extra;
```

## 🐛 Troubleshooting

### Common Issues

1. **"Environment validation failed"**
   - Run `pnpm env:validate` to see specific errors
   - Check that all required variables are set
   - Verify payment mode matches environment

2. **"Database connection failed"**
   - Verify `DATABASE_URL` is correct
   - Check database server is running
   - Ensure network connectivity

3. **"API calls failing in web app"**
   - Check `NEXT_PUBLIC_API_URL` is set correctly
   - Verify CORS configuration for cross-origin requests
   - Ensure backend is running and accessible

4. **"Mobile app can't connect to API"**
   - Verify `EXPO_PUBLIC_API_URL` in app.config.ts
   - Use tunnel URL for local development on physical device
   - Check network connectivity on device

### Environment Debugging

```bash
# Check current environment
pnpm env:validate

# View environment variables (be careful with secrets!)
node -e "console.log(process.env.APP_ENV)"

# Test database connection
pnpm env:validate | grep "Database"
```

## 🏗️ Adding New Environment Variables

1. **Add to schema** in `packages/config/env.ts`:
   ```typescript
   const baseEnvSchema = {
     // ... existing variables
     NEW_SERVICE_API_KEY: z.string().optional(),
     NEXT_PUBLIC_NEW_SERVICE_KEY: z.string().optional(),
   };
   ```

2. **Add to templates** (`env.*.example`):
   ```bash
   # New Service
   NEW_SERVICE_API_KEY=your_secret_key
   NEXT_PUBLIC_NEW_SERVICE_KEY=your_public_key
   ```

3. **Update validation** if needed:
   ```typescript
   if (env.APP_ENV === 'production' && !env.NEW_SERVICE_API_KEY) {
     ctx.addIssue({ /* error */ });
   }
   ```

4. **Update this guide** with the new variable information.

## 📚 References

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Zod Validation](https://zod.dev/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
