import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // <- enable static export
  trailingSlash: true, // <- ensure trailing slashes for static export
  images: {
    unoptimized: true, // <- disable image optimization for static export
  },
  // Disable server-side features for Electron
  experimental: {
    esmExternals: false,
  },
  // Ensure proper asset paths for Electron
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
};
