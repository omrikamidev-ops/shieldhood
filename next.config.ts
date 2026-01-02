import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable Node.js runtime for middleware (workaround for __dirname issue)
    nodeMiddleware: true,
  },
};

export default nextConfig;
