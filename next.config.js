const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
module.exports = withCSS(
  withSass({
    webpack(config, { dev }) {
      if (config.mode === "production") {
        if (Array.isArray(config.optimization.minimizer)) {
          config.optimization.minimizer.push(new OptimizeCSSAssestsPlugin());
        }
      }
      return config;
    }
  })
);
