import type { NextConfig } from "next";

// Empty for a root deploy (Cloudflare Pages). Set NEXT_PUBLIC_BASE_PATH=/slow-stack
// for GitHub Pages project sites.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
