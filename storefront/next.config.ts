import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static export untuk GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/Ecommerce1' : '', // Base path sesuai repository name
  trailingSlash: true, // Tambahkan trailing slash untuk kompatibilitas GitHub Pages
  
  // Skip API routes saat static export (GitHub Pages tidak support API routes)
  skipTrailingSlashRedirect: true,
  
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
    ],
    unoptimized: true, // Wajib true untuk static export
  },
};

export default nextConfig;
