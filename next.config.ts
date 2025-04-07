import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/', // Root URL
        destination: '/promotion-management', // Redirect to /order-management
        permanent: true, // Set to true if this is a permanent redirect (HTTP 308)
      },
    ];
  },
};

export default nextConfig;