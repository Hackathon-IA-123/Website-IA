import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Avatars Google
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
