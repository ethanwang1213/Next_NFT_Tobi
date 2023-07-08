/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
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
          // "https://firebasestorage.googleapis.com/v0/b/tobiratory.appspot.com/o/:path*",
          `${process.env.FIREBASE_API_URL}/:path*`,
      },
      {
        source: "/i2m/:path*",
        // destination: "https://image2model-fxkvliun3q-an.a.run.app/:path*",
        destination: `${process.env.IMAGE2MODEL_URL}/:path*`,
      },
      {
        source: "/login",
        destination: `${process.env.JOURNAL_URL}/journal/login`,
      },
      {
        source: "/journal",
        destination: `${process.env.JOURNAL_URL}/journal`,
      },
      {
        source: "/journal/:path*",
        destination: `${process.env.JOURNAL_URL}/journal/:path*`,
      },
      {
        source: "/backend/:path*",
        destination: `${process.env.JOURNAL_URL}/backend/:path*`,
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
  transpilePackages: ["three", "ui"],
};
