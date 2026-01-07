/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.shopify.com',
      'images.pexels.com',
      'pixabay.com',
      "res.cloudinary.com",
      "bananaclub.co.in",
      "images.remotePatterns"
    ],
  },
};

export default nextConfig;
