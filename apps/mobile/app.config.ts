import type { ExpoConfig } from 'expo/config';
import 'dotenv/config';

const config: ExpoConfig = {
  name: 'vetted',
  slug: 'vetted',
  scheme: 'vetted',
  version: '1.0.0',
  platforms: ['ios', 'android'],
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || process.env.API_URL, // Backward compatibility
    razorpayKeyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
    agoraAppId: process.env.EXPO_PUBLIC_AGORA_APP_ID,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    appEnv: process.env.APP_ENV || 'local',
  },
};

export default config;


