import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Standalone mode: Creates a smaller, faster build specifically for production
  output: 'standalone',

  // 2. Disable Image Optimization: Prevents the server CPU from spiking on shared hosting
  images: {
    unoptimized: true,
  },
};

export default nextConfig;