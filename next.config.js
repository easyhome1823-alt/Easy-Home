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
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'co.pinterest.com',
      },
    ],
  },

  // ✅ Ignorar errores de ESLint durante el build en Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
