import withPWAInit from "@ducanh2912/next-pwa";

// Next.js configuration using ESM
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: true, // Temporariamente desativado devido a erro de build no ambiente atual (Unexpected early exit)
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Base configuration
  reactStrictMode: true,
};

export default withPWA(nextConfig);
