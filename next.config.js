/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    images: {
      domains: [
        'images.unsplash.com',
        'i.pravatar.cc'    // Added this domain
      ],
    },
  }
  
  module.exports = nextConfig