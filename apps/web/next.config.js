/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            ref: true,
          },
        },
      ],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination:
          "https://firebasestorage.googleapis.com/v0/b/tobiratory.appspot.com/o/:path*",
      },
      {
        source: "/i2m/:path*",
        destination: "https://image2model-fxkvliun3q-an.a.run.app/:path*",
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [
      16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828, 1080, 1200, 1920,
      2048, 3840,
    ],
  },
};

const withTM = require("next-transpile-modules")(["three"]);

module.exports = withTM(nextConfig);
