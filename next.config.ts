import type { NextConfig } from 'next';
import { NGU_REDIRECTS } from './lib/ngu-redirects';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.michaelzick.com',
      },
      {
        protocol: 'https',
        hostname: 'michaelzick.com',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
      },
    ],
  },
  async redirects() {
    return [
      // Pages redirect straight to Nice Guy University from either host, so
      // apex visitors skip the www hop.
      ...NGU_REDIRECTS,
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'michaelzick.com' }],
        destination: 'https://www.michaelzick.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
