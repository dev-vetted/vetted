#!/usr/bin/env tsx

import * as dotenv from 'dotenv';

// Load environment variables from .env.local FIRST
const result = dotenv.config({ path: '.env.local' });
if (result.error) {
  console.log('⚠️  Could not load .env.local file:', result.error.message);
} else {
  console.log('✅ Loaded environment from .env.local');
}

// Import config AFTER loading environment
import { validateEnvironment, envServer, envClient, envMobile } from '@vetted/config/env';
import { prisma } from '@vetted/db';

async function main() {
  console.log('🔍 Environment Validation Report\n');
  
  // Basic environment info
  console.log('📋 Environment Information:');
  console.log(`   APP_ENV: ${process.env.APP_ENV || 'local'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'Not set'}`);
  console.log(`   Payments Mode: ${process.env.PAYMENTS_MODE || 'Not set'}`);
  console.log();

  // Validate environment configuration
  const validation = validateEnvironment();
  
  if (validation.errors.length > 0) {
    console.log('❌ Environment Errors:');
    validation.errors.forEach(error => console.log(`   • ${error}`));
    console.log();
  }

  if (validation.warnings.length > 0) {
    console.log('⚠️  Environment Warnings:');
    validation.warnings.forEach(warning => console.log(`   • ${warning}`));
    console.log();
  }

  if (validation.isValid) {
    console.log('✅ Environment configuration is valid!');
  } else {
    console.log('❌ Environment configuration has errors!');
  }

  // Test database connectivity
  console.log('\n🗄️  Database Connectivity Test:');
  try {
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('   ✅ Database connection successful');
    console.log(`   📊 Database URL: ${envServer.DATABASE_URL?.replace(/:[^:@]+@/, ':***@') || 'Not configured'}`);
  } catch (error) {
    console.log('   ❌ Database connection failed');
    console.log(`   💥 Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    await prisma.$disconnect();
  }

  // Service Configuration Summary
  console.log('\n🛠️  Service Configuration:');
  console.log(`   Payments: ${process.env.PAYMENTS_MODE || 'Not configured'}`);
  console.log(`   Razorpay: ${process.env.RAZORPAY_KEY_ID ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Agora: ${process.env.AGORA_APP_ID ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Supabase: ${process.env.SUPABASE_URL ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Redis: ${process.env.UPSTASH_REDIS_URL ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   S3: ${process.env.S3_BUCKET ? '✅ Configured' : '❌ Not configured'}`);

  // Client-side variables (safe to expose)
  console.log('\n🌐 Client Variables:');
  console.log(`   API URL: ${process.env.NEXT_PUBLIC_API_URL || 'Not set'}`);
  console.log(`   Razorpay Key: ${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'Not set'}`);
  console.log(`   Agora App ID: ${process.env.NEXT_PUBLIC_AGORA_APP_ID || 'Not set'}`);

  // Mobile variables
  console.log('\n📱 Mobile Variables:');
  console.log(`   API URL: ${process.env.EXPO_PUBLIC_API_URL || 'Not set'}`);
  console.log(`   Razorpay Key: ${process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'Not set'}`);
  console.log(`   Agora App ID: ${process.env.EXPO_PUBLIC_AGORA_APP_ID || 'Not set'}`);

  process.exit(validation.isValid ? 0 : 1);
}

main().catch((error) => {
  console.error('💥 Validation script failed:', error);
  process.exit(1);
});
