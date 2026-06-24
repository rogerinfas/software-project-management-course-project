import type { NextConfig } from "next";

import path from "path";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  // Required for Docker standalone image (production)
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  /**
   * Proxy all /api/* requests to the NestJS backend.
   * This makes Better Auth cookies same-site (set on the frontend domain),
   * solving cross-origin cookie issues in production.
   */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
