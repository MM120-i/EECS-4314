import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  output: "export",
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
