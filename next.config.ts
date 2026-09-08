import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AVIF is not emitted by default (WebP only); enable it explicitly so the
  // photo-led home page hits the Lighthouse mobile >=90 target. See design doc.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // No `output: 'export'` — that would break the /api/contact Route Handler.
  // Every page opts into static rendering via `export const dynamic = 'force-static'`.
};

export default nextConfig;
