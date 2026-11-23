/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'alfalahcsc.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.alfalahcsc.com',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    const apiTarget = process.env.INTERNAL_API_URL || 'http://backend:4000/api/v1';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
