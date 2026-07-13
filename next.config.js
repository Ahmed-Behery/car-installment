/** @type {import('next').NextConfig} */

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubActions ? "/car-installment" : "";

const nextConfig = {
  reactStrictMode: true,

  output: "export",
  trailingSlash: true,

  basePath,
  assetPrefix: basePath,

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "contact-app-prod.s3.us-east-2.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;