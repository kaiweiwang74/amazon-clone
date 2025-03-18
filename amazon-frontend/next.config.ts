import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com", // ✅ Add allowed external domain
      },
    ],
  },
};

export default nextConfig;
