const path = require('path');

module.exports = (storybookBaseConfig, configType, defaultConfig) => {
  storybookBaseConfig.module.rules.push({
    test: /\.less$/,
    loaders: ["css-loader", "less-loader"]
  });

  storybookBaseConfig.resolve.alias = {
    'apis': path.resolve(__dirname, '../src/js/apis'),
    'components': path.resolve(__dirname, '../src/js/components'),
    'models': path.resolve(__dirname, '../src/js/models')
  }

  return storybookBaseConfig;
};