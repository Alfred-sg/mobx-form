const path = require('path');

module.exports = function(config){
  config.resolve.alias = {
    'apis': path.resolve(__dirname, 'src/js/apis'),
    'components': path.resolve(__dirname, 'src/js/components'),
    'models': path.resolve(__dirname, 'src/js/models'),
  }
}