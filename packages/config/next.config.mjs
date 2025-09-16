/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
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


