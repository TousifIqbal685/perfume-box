import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Keep Standalone mode
  output: 'standalone',

  // 2. Disable Image Optimization (Save CPU)
  images: {
    unoptimized: true,
  },
  
  // 3. Disable Linting during build (Save RAM)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 4. Disable TypeScript errors during build (Save RAM)
  typescript: {
    ignoreBuildErrors: true,
  },

  // 5. Disable Source Maps (Save Disk & RAM)
  productionBrowserSourceMaps: false,
};

export default nextConfig;