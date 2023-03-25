const path = require("path");

module.exports = {
  webpack(config) {
    config.resolve.alias["@shared-components"] = path.join(
      __dirname,
      "../../libs/shared-components/src"
    );
    config.resolve.alias["@utils"] = path.join(
      __dirname,
      "../../libs/utils/src"
    );
    return config;
  },
};
