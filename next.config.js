// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "mellifluous-empanada-fa5948.netlify.app" },
      { protocol: "https", hostname: "sprint-fe-project.s3.ap-northeast-2.amazonaws.com" },
      { protocol: "https", hostname: "panda-market-api.vercel.app" },
      { protocol: "https", hostname: "**" }, 
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;