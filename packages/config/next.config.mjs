/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Ensure Prisma client and engines are included in serverless output
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
    outputFileTracingIncludes: {
      '/*': [
        './node_modules/@prisma/client',
        './node_modules/.prisma'
      ],
    },
  },
  transpilePackages: [
    '@vetted/ui',
    '@vetted/types',
    '@vetted/config',
    '@vetted/ports',
    '@vetted/adapters',
    '@vetted/container',
    '@vetted/db',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
    };
    return config;
  },
};

export default baseConfig;


