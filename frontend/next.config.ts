import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  // Required for Docker standalone image (production)
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
};

export default nextConfig;
