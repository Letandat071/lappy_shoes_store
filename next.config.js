/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'www.pngall.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.donmai.us',
      },
      {
        protocol: 'https',
        hostname: 'static.zerochan.net',
      }
    ]
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  experimental: {
    scrollRestoration: false
  }
}

module.exports = nextConfig 