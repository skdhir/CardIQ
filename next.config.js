/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    DATA_DIR: process.env.DATA_DIR,
  },
};

module.exports = nextConfig;
