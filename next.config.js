module.exports = {
  webpack(config, options) {
    // Fixes npm packages that depend on `fs` module
    if (!options.isServer) {
      config.node = {
        fs: "empty",
      };
    }

    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: "worker-loader",
      // options: { inline: true }, // also works
      options: {
        name: "static/[hash].worker.js",
        publicPath: "/_next/",
      },
    });
    return config;
  },
};
