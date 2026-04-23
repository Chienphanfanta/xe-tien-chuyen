import type { NextConfig } from "next"
import nextPWA from "next-pwa"

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "maps.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
}

// next-pwa's bundled types reference Next 13's NextConfig, which differs from
// Next 16's. The runtime is unaffected; revisit if next-pwa updates its types.
// @ts-expect-error -- known type mismatch between next-pwa@5 and next@16
export default withPWA(nextConfig) as NextConfig
