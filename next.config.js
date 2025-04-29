/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['example.com', 'localhost'],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
}

module.exports = nextConfig 