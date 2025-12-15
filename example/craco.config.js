const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Allow imports from outside src/
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        (plugin) => plugin.constructor.name !== "ModuleScopePlugin"
      );

      // Add parent src to module resolution
      webpackConfig.resolve.modules.push(path.resolve(__dirname, "../src"));

      return webpackConfig;
    },
  },
};
