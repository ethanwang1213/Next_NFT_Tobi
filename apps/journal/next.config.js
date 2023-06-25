module.exports = {
  basePath: "/journal",
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    domains: ["storage.googleapis.com"],
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
        source: "/:path*",
        destination: `/journal/:path*`,
      },
      {
        basePath: false,
        source: "/proxy/:path*",
        destination:
          // "http://127.0.0.1:7777/v0/b/tobiratory-f6ae1.appspot.com/o/:path*",
          // "https://firebasestorage.googleapis.com/v0/b/tobiratory.appspot.com/o/:path*",
          // "https://firebasestorage.googleapis.com/v0/b/tobiratory-f6ae1.appspot.com/o/:path*",
          `${process.env.FIREBASE_API_URL}/:path*`,
      },
      {
        basePath: false,
        source: "/backend/api/functions/:path*",
        destination:
          // "http://localhost:5001/tobiratory-f6ae1/asia-northeast1/:path*",
          // "https://asia-northeast1-tobiratory-f6ae1.cloudfunctions.net/:path*",
          `${process.env.CLOUD_FUNCTIONS_API_URL}/:path*`,
      },
    ];
  },
};
