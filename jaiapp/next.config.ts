import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ui-avatars.com'], // Add ui-avatars.com as an allowed image domain
  },
};

export default nextConfig;
