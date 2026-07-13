/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["ar", "en"],
    defaultLocale: "ar",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "contact-app-prod.s3.us-east-2.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
