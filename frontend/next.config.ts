import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  headers: async () => [
    {
      source: "/api/symptoms",
      headers: [{ key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" }],
    },
    {
      source: "/api/remedies",
      headers: [{ key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" }],
    },
    {
      source: "/api/symptoms/:path*",
      headers: [{ key: "Cache-Control", value: "public, s-maxage=600, stale-while-revalidate=3600" }],
    },
    {
      source: "/api/remedies/:path*",
      headers: [{ key: "Cache-Control", value: "public, s-maxage=600, stale-while-revalidate=3600" }],
    },
  ],
};

export default nextConfig;
