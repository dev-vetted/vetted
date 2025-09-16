import type { ExpoConfig } from 'expo/config';
import 'dotenv/config';

const config: ExpoConfig = {
  name: 'vetted',
  slug: 'vetted',
  scheme: 'vetted',
  version: '1.0.0',
  platforms: ['ios', 'android'],
  extra: {
    apiUrl: process.env.API_URL,
  },
};

export default config;


