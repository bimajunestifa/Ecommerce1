import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	turbopack: { root: process.cwd() },
  // Hanya enable static export di production jika diperlukan
  // Untuk development, API routes harus bekerja
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' ? { output: 'export' } : {}),
  basePath: process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' ? '/Ecommerce1' : '', // Base path sesuai repository name
  trailingSlash: true, // Tambahkan trailing slash untuk kompatibilitas GitHub Pages
  skipTrailingSlashRedirect: true,
  
  // Exclude API routes from build
  distDir: '.next',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',
      },
      {
        protocol: 'https',
        hostname: '**.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: '**.ibb.co.com',
      },
      {
        protocol: 'https',
        hostname: '**.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'static.nike.com',
      },
      {
        protocol: 'https',
        hostname: '**.nike.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.ncrsport.com',
      },
      {
        protocol: 'https',
        hostname: '**.ncrsport.com',
      },
      {
        protocol: 'https',
        hostname: 'images.stockx.com',
      },
      {
        protocol: 'https',
        hostname: '**.stockx.com',
      },
      {
        protocol: 'https',
        hostname: 'senikersku.com',
      },
      {
        protocol: 'https',
        hostname: '**.senikersku.com',
      },
    ],
    unoptimized: true, // Wajib true untuk static export
  },
};

export default nextConfig;
