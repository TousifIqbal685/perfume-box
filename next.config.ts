import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "emsivsdeacgigsxnsmho.supabase.co", // Whitelisting your Supabase Storage
      },
    ],
  },
};

export default nextConfig;