const { i18n } = require('./next-i18next.config');

module.exports = {
  basePath: "/admin",
  reactStrictMode: true,
  transpilePackages: ["ui"],
  compiler: {
    removeConsole: process.env.DEPLOY_ENV === "production",
  },
  images: {
    domains: ["storage.googleapis.com", "firebasestorage.googleapis.com"],
  },
  eslint: {
    dirs: ["./src", "../../packages"],
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
    config.module.rules.push({
      test: /\.glb$/i,
      type: "asset/resource",
    });
    return config;
  },
  async rewrites() {
    return [
      {
        basePath: false,
        source: "/:locale(en|jp)/proxy/:path*",
        destination:
          // "http://127.0.0.1:7777/v0/b/tobiratory-f6ae1.appspot.com/o/:path*",
          // "https://firebasestorage.googleapis.com/v0/b/tobiratory.appspot.com/o/:path*",
          // "https://firebasestorage.googleapis.com/v0/b/tobiratory-f6ae1.appspot.com/o/:path*",
          `${process.env.FIREBASE_API_URL}/:path*`,
      },
      {
        basePath: false,
        source: "/:locale(en|jp)/backend/api/functions/:path*",
        destination:
          // "http://localhost:5001/tobiratory-f6ae1/asia-northeast1/:path*",
          // "https://asia-northeast1-tobiratory-f6ae1.cloudfunctions.net/:path*",
          `${process.env.CLOUD_FUNCTIONS_API_URL}/:path*`,
      },
      {
        source: '/:locale(en|jp)/:path*',
        destination: `/admin/:path*`,
      },
    ];
  },
  i18n,
};
