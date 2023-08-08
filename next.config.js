/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  // openAnalyzer: false,
});
const nextConfig = {
  swcMinify: true,
  // reactStrictMode: true,
  experimental: {
    turbotrace: {
      // control the log level of the turbotrace, default is `error`
      logLevel: "suggestions",
    },
    // instrumentationHook: true,
    // appDir: true,
  },
  async redirects() {
    return [
      {
        source: "/deposit",
        destination: "/stash",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path(.+\\.(?:ico|png|svg|jpg|jpeg|gif|webp|json|js|css|mp3|mp4|ttf|ttc|otf|woff|woff2)$)',
        locale: false,
        // https://docs.unity3d.com/560/Documentation/Manual/webgl-networking.html
        headers: [
          { key: "Access-Control-Expose-Headers", value: "Status" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Access-Token, X-Application-Name, X-Request-Sent-Time, X-CSRF-Token, X-Requested-With",
          },
        ],
      },
    ];
  },
  images: {
    domains: ["pbs.twimg.com"],
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  env: {
    MAINNET_PRIMARY: process.env.MAINNET_PRIMARY,
    MAINNET_SECONDARY: process.env.MAINNET_SECONDARY,
    DARKBLOCK_API_KEY: process.env.DARKBLOCK_API_KEY,
    MATRICA_API_KEY: process.env.MATRICA_API_KEY,
    IS_DEV: process.env.IS_DEV,
  },
  outputFileTracing: false,
  // sideEffects: ["/src/types/api_docs/zodOpenApi.ts"],
  webpack: (config) => {
    config.resolve.extensions = [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"];
    // (config.sideEffects = ["/src/types/api_docs/zodOpenApi.ts"]),
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      os: false,
    };
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
