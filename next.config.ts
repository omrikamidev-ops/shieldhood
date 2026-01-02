import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force Edge Runtime for middleware
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
