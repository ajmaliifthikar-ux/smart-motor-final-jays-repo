/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      // Canonical homepage redirect
      {
        source: '/new-home',
        destination: '/',
        permanent: true,
      },
      // Smart Tips
      {
        source: '/new-home/smart-tips/:slug',
        destination: '/smart-tips/:slug',
        permanent: true,
      },
      {
        source: '/new-home/smart-tips',
        destination: '/smart-tips',
        permanent: true,
      },
      // Services
      {
        source: '/new-home/services/:slug',
        destination: '/services/:slug',
        permanent: true,
      },
      {
        source: '/new-home/services',
        destination: '/services',
        permanent: true,
      },
      // Brands
      {
        source: '/new-home/brands/:slug',
        destination: '/brand/:slug',
        permanent: true,
      },
      {
        source: '/new-home/brands',
        destination: '/',
        permanent: true,
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
  },

  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  output: 'standalone',
}

module.exports = nextConfig
