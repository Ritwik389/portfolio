/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.30'],
  ...(process.env.PORTFOLIO_STATIC_EXPORT === '1' ? { output: 'export' } : {}),
  trailingSlash: true,
  turbopack: { root: __dirname },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
};

module.exports = nextConfig;
