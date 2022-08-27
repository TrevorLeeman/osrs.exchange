/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['oldschool.runescape.wiki'],
  },
};

module.exports = nextConfig;
