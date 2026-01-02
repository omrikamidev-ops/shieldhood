import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure middleware runs in Edge Runtime
  experimental: {
    // This ensures middleware uses Edge Runtime
  },
};

export default nextConfig;
