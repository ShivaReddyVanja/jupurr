import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
    ignoreBuildErrors: true, // 🚨 Allow builds with type errors
   

  },
};

export default nextConfig;
