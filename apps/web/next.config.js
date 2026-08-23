/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@agentguard/types'],
  experimental: { typedRoutes: false },
};

module.exports = nextConfig;
