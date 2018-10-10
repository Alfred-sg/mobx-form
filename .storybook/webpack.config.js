const path = require('path');

module.exports = (storybookBaseConfig, configType, defaultConfig) => {
  storybookBaseConfig.module.rules.push({
    test: /\.less$/,
    loaders: ["css-loader", "less-loader"]
  });

  storybookBaseConfig.resolve.alias = {
    'apis': path.resolve(__dirname, '../src/apis'),
    'components': path.resolve(__dirname, '../src/components'),
    'models': path.resolve(__dirname, '../src/models')
  }

  return storybookBaseConfig;
};