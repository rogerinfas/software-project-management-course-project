import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const prototypeRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactCompiler: true,
  /** Use this app folder as the workspace root when multiple lockfiles exist (repo root + prototype). */
  turbopack: {
    root: prototypeRoot,
  },
};

export default nextConfig;
