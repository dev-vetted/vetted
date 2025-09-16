import baseConfig from "@vetted/config/next.config.mjs";

/** @type {import('next').NextConfig} */
const config = {
  ...baseConfig,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;


