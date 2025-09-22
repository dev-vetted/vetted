import baseConfig from "@vetted/config/next.config.mjs";
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

/** @type {import('next').NextConfig} */
const config = {
  ...baseConfig,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    ...(baseConfig.experimental || {}),
    outputFileTracingRoot: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../'),
    outputFileTracingIncludes: {
      ...(baseConfig.experimental?.outputFileTracingIncludes || {}),
      '*': [
        './node_modules/.prisma/client',
        './node_modules/@prisma/client',
        './prisma',
      ],
    },
  },
  webpack: (config, { isServer }) => {
    if (typeof baseConfig.webpack === 'function') {
      config = baseConfig.webpack(config)
    }
    if (isServer) {
      config.plugins = [...(config.plugins || []), new PrismaPlugin()]
    }
    return config
  },
};

export default config;


